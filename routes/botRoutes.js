// const express = require("express");
// const router = express.Router();

// router.post("/bot", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // Simple bot reply (later we can connect AI / DB)
//     let reply = "I didn’t understand that.";
//     if (message.toLowerCase().includes("hello")) {
//       reply = "Hello! How can I help you today?";
//     }
//     if (message.toLowerCase().includes("medicine")) {
//       reply = "Please provide the medicine name and I’ll fetch details.";
//     }

//     res.json({ reply });
//   } catch (err) {
//     console.error("Bot error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

// // backend/routes/botRoutes.js
// const express = require("express");
// const router = express.Router();
// const { OpenAI } = require("openai");
// const multer = require("multer");
// require("dotenv").config();

// const upload = multer(); // for handling audio uploads in memory

// // 🔹 OpenAI client
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // 🔹 Voice mapping
// const voiceMap = {
//   en: "alloy",   // English
//   hi: "alloy",   // Hindi
//   te: "alloy",   // Telugu
//   ta: "alloy",   // Tamil
//   ml: "alloy"    // Malayalam
// };

// // =========================
// // 🎤 Speech-to-Text API
// // =========================
// // 🎤 Speech-to-Text API
// router.post("/speech-to-text", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No audio file uploaded" });
//     }

//     // ✅ Convert Multer buffer into a File (Node >=18 supports this natively)
//     const audioFile = new File([req.file.buffer], "speech.webm", {
//       type: "audio/webm",
//     });

//     const transcription = await openai.audio.transcriptions.create({
//       file: audioFile,
//       model: "gpt-4o-mini-transcribe", // or "whisper-1"
//     });

//     res.json({ text: transcription.text });
//   } catch (err) {
//     console.error("STT Error:", err);
//     res.status(500).json({
//       error: "Speech-to-text failed",
//       details: err.message,
//     });
//   }
// });



// // =========================
// // 💬 Chat + TTS API
// // =========================
// router.post("/chat", async (req, res) => {
//   try {
//     const { message, language = "en" } = req.body;

//     if (!message) return res.status(400).json({ error: "Message is required" });

//     // 1️⃣ AI reply in selected language
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful medicine assistant bot.
//                     Always reply in ${
//                       language === "en"
//                         ? "English"
//                         : language === "hi"
//                         ? "Hindi"
//                         : language === "te"
//                         ? "Telugu"
//                         : language === "ta"
//                         ? "Tamil"
//                         : language === "ml"
//                         ? "Malayalam"
//                         : "English"
//                     }.
//                     Keep answers clear and short.`,
//         },
//         { role: "user", content: message },
//       ],
//     });

//     const replyText = completion.choices[0].message.content;

//     // 2️⃣ Generate speech (TTS) from reply
//     const voice = voiceMap[language] || "alloy";

//     let audioBase64 = null;
//     try {
//       const audioResponse = await openai.audio.speech.create({
//         model: "gpt-4o-mini-tts",
//         voice,
//         input: replyText,
//       });

//       const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
//       audioBase64 = audioBuffer.toString("base64");
//     } catch (ttsErr) {
//       console.error("TTS Error:", ttsErr.message);
//     }

//     // 3️⃣ Send response back
//     res.json({
//       reply: replyText,
//       audioBase64,
//     });
//   } catch (err) {
//     console.error("Chat API Error:", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// module.exports = router;


// backend/routes/botRoutes.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const multer = require("multer");
require("dotenv").config();

const upload = multer(); // for handling audio uploads in memory
const Medicine = require("../models/Medicine"); // adjust path if needed

// 🔹 OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔹 Voice mapping
const voiceMap = {
  en: "alloy",   // English
  hi: "alloy",   // Hindi
  te: "alloy",   // Telugu
  ta: "alloy",   // Tamil
  ml: "alloy"    // Malayalam
};

// =========================
// 🎤 Speech-to-Text API
// =========================
router.post("/speech-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFile = new File([req.file.buffer], "speech.webm", {
      type: "audio/webm",
    });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
    });

    res.json({ text: transcription.text });
  } catch (err) {
    console.error("STT Error:", err);
    res.status(500).json({
      error: "Speech-to-text failed",
      details: err.message,
    });
  }
});

// =========================
// 💬 Chat + Add Medicines + TTS
// =========================
router.post("/chat", async (req, res) => {
  try {
    const { message, language = "en", userId } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let replyText = "";

    // ✅ CASE 1: Add medicines
    if (message.toLowerCase().includes("add medicine")) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a medicine data extractor.
                      The user will ask to add medicines with times.
                      Return ONLY valid JSON like this:
                      {
  "medicines": [
    { 
      "name": "Paracetamol", 
      "dosage": "2 tablets",
      "times": ["09:00", "11:00"], 
    },
    { 
      "name": "Amoxicillin", 
      "dosage": "500 mg",
      "times": ["10:00"], 
    }
  ]
}


                      Rules:
                      - Always return an array of medicines (even if only one).
                      - Convert times like "9am", "11 am", "9:30 pm" into 24h format (HH:mm).
                      - Multiple times must be an array.
                      - No extra text, no explanations.`
          },
          { role: "user", content: message }
        ],
        temperature: 0,
      });

      const extracted = completion.choices[0].message.content.trim();
      let medData;
      try {
        medData = JSON.parse(extracted);
      } catch (e) {
        return res.json({ reply: "⚠️ I couldn’t understand the medicine details. Please try again." });
      }

      if (!medData.medicines || medData.medicines.length === 0) {
        return res.json({ reply: "⚠️ No valid medicines found." });
      }

      // Save all medicines
      for (const med of medData.medicines) {
         const newMed = new Medicine({
    userId,
    name: med.name,
    dosage: med.dosage || "as prescribed",
    frequency: med.frequency || "daily",
    doses: (med.times || []).map((t) => ({ time24: t })) // <-- use med.times
  });
        await newMed.save();
      }

     replyText = `✅ Added ${medData.medicines
  .map(m => `"${m.name}" (${m.dosage || "as prescribed"}, ${m.frequency || "daily"}) at ${ (m.times || []).join(", ") }`)
  .join("; ")}.`;

    // ✅ CASE 2: Show pending / upcoming medicines
    } 
    // ✅ CASE 2: Show upcoming / active / completed medicines
  else if (
  message.toLowerCase().includes("pending") ||
  message.toLowerCase().includes("reminder") ||
  message.toLowerCase().includes("next medicine") ||
  message.toLowerCase().includes("active medicine") ||
  message.toLowerCase().includes("upcoming") ||
  message.toLowerCase().includes("today's medicine") ||
  message.toLowerCase().includes("current medicine") ||
  message.toLowerCase().includes("due medicine") ||
  message.toLowerCase().includes("medication") ||
  message.toLowerCase().includes("completed") ||
  message.toLowerCase().includes("taken")
) {
  const Medicines = await Medicine.find({ userId });

  const upcoming = [];
  const active = [];
  const completed = [];

  Medicines.forEach((med) => {
    if (!Array.isArray(med.doses)) return;

    med.doses.forEach((dose) => {
      if (!dose.time24) return;

      const [hour, min] = dose.time24.split(":").map(Number);
      const doseMinutes = hour * 60 + min;

      if (currentMinutes < doseMinutes) {
        // future dose → upcoming
        upcoming.push(`${med.name} at ${dose.time24}`);
      } else if (currentMinutes >= doseMinutes && currentMinutes <= doseMinutes + 15) {
        // within 15 minutes → active
        active.push(`${med.name} at ${dose.time24}`);
      } else {
        // past dose → completed
        completed.push(`${med.name} at ${dose.time24}`);
      }
    });
  });

  // 📌 Respond based on what user asked
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("upcoming") || lowerMsg.includes("next")) {
    replyText =
      upcoming.length > 0
        ? `⏰ Upcoming medicines:\n${upcoming.join("\n")}`
        : "No upcoming medicines right now.";
  } else if (lowerMsg.includes("active") || lowerMsg.includes("current") || lowerMsg.includes("due")) {
    replyText =
      active.length > 0
        ? `⚡ Active medicines:\n${active.join("\n")}`
        : "No active medicines right now.";
  } else if (lowerMsg.includes("completed") || lowerMsg.includes("taken")) {
    replyText =
      completed.length > 0
        ? `✅ Completed medicines:\n${completed.join("\n")}`
        : "No completed medicines yet.";
  } else {
    // default: show everything nicely grouped
    replyText = "";
    if (completed.length > 0) replyText += `✅ Completed medicines:\n${completed.join("\n")}\n\n`;
    if (active.length > 0) replyText += `⚡ Currently active medicines:\n${active.join("\n")}\n\n`;
    if (upcoming.length > 0) replyText += `⏰ Upcoming medicines:\n${upcoming.join("\n")}\n\n`;
    if (!replyText) replyText = "No medicines scheduled at the moment.";
  }
  
   

    // ✅ CASE 3: Fallback to normal AI chat
    } 
    else {
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",  
        messages: [
          {
            role: "system",
            content: `You are a helpful medicine assistant bot.
                      Always reply in ${language}. Keep answers clear and short.`
          },
          { role: "user", content: message },
        ],
      });

      replyText = completion.choices[0].message.content;
    }

    // 🔊 TTS
    const voice = voiceMap[language] || "alloy";
    let audioBase64 = null;
    try {
      const audioResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice,
        input: replyText,
      });

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      audioBase64 = audioBuffer.toString("base64");
    } catch (ttsErr) {
      console.error("TTS Error:", ttsErr.message);
    }

    res.json({ reply: replyText, audioBase64 });

  } catch (err) {
    console.error("Chat API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
  
});




module.exports = router;
