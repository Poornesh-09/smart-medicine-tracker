// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const botRoutes = require("./routes/botRoutes");
// const prescriptionRoutes = require('./routes/prescription');

// const app = express();
// app.use(cors());
// app.use(express.json());


// app.use("/api", botRoutes);
// app.use('/api/prescription', prescriptionRoutes);
// const uploadRoutes = require("./routes/uploadRoutes");
// app.use("/api", uploadRoutes);





// const authRoutes = require('./routes/auth');
// const medicineRoutes = require('./routes/medicines');
// const llmRoutes = require('./routes/llm');

// app.use('/api/auth', authRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/llm', llmRoutes);

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//   console.log('MongoDB connected');
//   app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// })
// .catch(err => console.error('MongoDB connection error', err));


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const multer = require('multer');
// const OpenAI = require('openai');

// // Existing routes
// const botRoutes = require("./routes/botRoutes");
// const prescriptionRoutes = require('./routes/prescription');
// const uploadRoutes = require("./routes/uploadRoutes");
// const authRoutes = require('./routes/auth');
// const medicineRoutes = require('./routes/medicines');
// const llmRoutes = require('./routes/llm');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Multer setup for uploads
// const upload = multer({ dest: "uploads/" });

// // OpenAI client
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // MongoDB schema for uploaded prescription reports
// // const ReportSchema = new mongoose.Schema({
// //   medications: { type: Array, default: [] },
// //   condition: { type: String, default: "" },
// //   rawText: { type: String, default: "" },
// //   createdAt: { type: Date, default: Date.now },
// // });
// // const Report = mongoose.model("Report", ReportSchema);

// const ReportSchema = new mongoose.Schema({
//   medications: [
//     {
//       name: { type: String, required: true },
//       dosage: { type: String, default: "" },          // e.g., "500mg"
//       frequency: { type: String, default: "" },       // e.g., "2 times/day"
//       duration: { type: String, default: "" },        // e.g., "5 days"
//       instructions: { type: String, default: "" },    // e.g., "After meals"
//       time: { type: String, default: "" },            // specific time like "08:00"
//       date: { type: Date, default: Date.now }         // prescription date
//     }
//   ],
//   condition: { type: String, default: "" },
//   rawText: { type: String, default: "" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Report = mongoose.model("Report", ReportSchema);
// // --- Upload prescription + parse with OpenAI ---
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

//     const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

//     // Call OpenAI for parsing
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a medical prescription parser. Always return JSON with fields: medications (array of {name, dose, frequency, duration, instructions}) and condition (string)."
//         },
//         {
//           role: "user",
//           content: [
//             { type: "text", text: "Extract medicines from this prescription image." },
//             { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
//           ]
//         }
//       ],
//       response_format: { type: "json_object" },
//     });

//     // --- Helper to clean Markdown-wrapped JSON ---
//     function parseAIResponse(text) {
//       let cleaned = text.trim();
//       if (cleaned.startsWith("```json")) {
//         cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
//       } else if (cleaned.startsWith("```")) {
//         cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
//       }
//       return JSON.parse(cleaned);
//     }

//     let reportData;
//     try {
//       reportData = parseAIResponse(response.choices[0].message.content);
//     } catch (err) {
//       return res.json({
//         success: false,
//         message: "AI response not valid JSON",
//         raw: response.choices[0].message.content
//       });
//     }

//     // Ensure defaults
//     reportData.medications = reportData.medications || [];
//     reportData.condition = reportData.condition || "";
//     reportData.rawText = reportData.rawText || "";

//     // Save to MongoDB
//     const report = new Report(reportData);
//     await report.save();

//     res.json({ success: true, report: reportData });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({ success: false, error: err.message || "Failed to process prescription" });
//   }
// });

// // --- Get upload history ---
// app.get("/api/reports", async (req, res) => {
//   try {
//     const reports = await Report.find().sort({ createdAt: -1 });
//     res.json({ success: true, reports });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // --- Existing routes ---
// // app.use("/api", botRoutes);
// app.use("/api/bot", botRoutes);
// app.use('/api/prescription', prescriptionRoutes);
// app.use("/api", uploadRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/llm', llmRoutes);

// // --- Start server ---
// const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// mongoose.connect(process.env.MONGO_URI);



// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const multer = require('multer');
// const OpenAI = require('openai');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const upload = multer({ dest: 'uploads/' });

// // OpenAI client
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Gemini AI client
// const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // MongoDB schema
// const ReportSchema = new mongoose.Schema({
//   medications: [{ name: String, dose: String, frequency: String, duration: String, instructions: String }],
//   condition: String,
//   rawText: String,
//   createdAt: { type: Date, default: Date.now },
// });
// const Report = mongoose.model('Report', ReportSchema);

// // --- Upload prescription and parse ---
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

//     const imageBase64 = fs.readFileSync(req.file.path, { encoding: 'base64' });

//     // --- OpenAI Parsing ---
//     let openAIData = { medications: [], condition: '', rawText: '' };
//     try {
//       const openAIResp = await openai.chat.completions.create({
//         model: 'gpt-4o-mini',
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a medical prescription parser. Always return JSON with fields: medications (array of {name, dose, frequency, duration, instructions}) and condition (string).',
//           },
//           {
//             role: 'user',
//             content: [
//               { type: 'text', text: 'Extract medicines from this prescription image.' },
//               { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
//             ],
//           },
//         ],
//         response_format: { type: 'json_object' },
//       });

//       let content = openAIResp.choices[0].message.content;
//       if (content.startsWith('```json')) content = content.replace(/^```json\s*/, '').replace(/```$/, '').trim();
//       openAIData = JSON.parse(content);
//       openAIData.medications = openAIData.medications || [];
//       openAIData.condition = openAIData.condition || '';
//     } catch (err) {
//       console.error('OpenAI parsing error:', err.message);
//     }

//     // --- Gemini AI Parsing ---
//     let geminiData = { medications: [], condition: '' };
//     try {
//       const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
//       const imagePart = { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } };
//       const promptParts = [
//         {
//           text: `Extract medicines and condition from the uploaded prescription image and return JSON with medications and condition fields.`,
//         },
//         imagePart,
//       ];

//       const result = await model.generateContent(promptParts);
//       const response = await result.response;
//       const extractedText = response.text();
//       const match = extractedText.match(/({[\s\S]*})/);
//       geminiData = match ? JSON.parse(match[1]) : { medications: [], condition: '' };
//     } catch (err) {
//       console.error('Gemini AI error:', err.message);
//     }

//     // --- Save OpenAI output to MongoDB ---
//     const report = new Report({
//       medications: openAIData.medications,
//       condition: openAIData.condition,
//       rawText: openAIData.rawText || '',
//     });
//     await report.save();

//     res.json({
//       success: true,
//       openAI: openAIData,
//       gemini: geminiData,
//       reportId: report._id,
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // --- MongoDB connection & start server ---
// const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
//   .catch((err) => console.error('MongoDB error:', err));


////// IMP /////////

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const multer = require('multer');
// const OpenAI = require('openai');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const botRoutes = require("./routes/botRoutes");
// const prescriptionRoutes = require('./routes/prescription');
// const uploadRoutes = require("./routes/uploadRoutes");
// const authRoutes = require('./routes/auth');
// const medicineRoutes = require('./routes/medicines');
// const llmRoutes = require('./routes/llm');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const upload = multer({ dest: "uploads/" });

// // OpenAI client
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Gemini AI client
// const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // MongoDB schema
// const ReportSchema = new mongoose.Schema({
//   medications: [
//     {
//       name: { type: String, required: true },
//       dosage: { type: String, default: "" },
//       frequency: { type: String, default: "" },
//       duration: { type: String, default: "" },
//       instructions: { type: String, default: "" },
//       time: { type: String, default: "" },
//       date: { type: Date, default: Date.now }
//     }
//   ],
//   condition: { type: String, default: "" },
//   rawText: { type: String, default: "" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Report = mongoose.model("Report", ReportSchema);

// // --- Upload prescription + parse OpenAI + Gemini ---
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

//     const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

//     // --- OpenAI parsing ---
//     let openAIData = { medications: [], condition: "", rawText: "" };
//     try {
//       const openAIResp = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:  "You are a medical prescription parser. Always return JSON with fields: medications (array of {name, dose, frequency, duration, instructions}) and condition (string)."
//           },
//           {
//             role: "user",
//             content: [
//               { type: "text", text: "Extract medicines from this prescription image." },
//               { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
//             ]
//           }
//         ],
//         response_format: { type: 'json_object' }
//       });

//       let text = openAIResp.choices[0].message.content;
//       if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
//       openAIData = JSON.parse(text);
//       openAIData.medications = openAIData.medications || [];
//       openAIData.condition = openAIData.condition || "";
//       openAIData.rawText = openAIData.rawText || "";
//     } catch (err) {
//       console.error("OpenAI parsing error:", err.message);
//     }

//     // --- Gemini parsing ---
//     let geminiData = { medications: [], condition: "" };
//     try {
//       const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
//       const promptParts = [
//         { text:  "You are a medical prescription parser. Always return JSON with fields: medications (array of {name, dose, frequency, duration, instructions}) and condition (string)." },
//         { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
//       ];
//       const result = await model.generateContent(promptParts);
//       const response = await result.response;
//       const extractedText = response.text();
//       const match = extractedText.match(/({[\s\S]*})/);
//       geminiData = match ? JSON.parse(match[1]) : { medications: [], condition: "" };
//     } catch (err) {
//       console.error("Gemini AI error:", err.message);
//     }

//     // --- Save OpenAI data to MongoDB ---
//     const report = new Report({
//       medications: openAIData.medications,
//       condition: openAIData.condition,
//       rawText: openAIData.rawText || "",
//     });
//     await report.save();

//     res.json({
//       success: true,
//       openAI: openAIData,
//       gemini: geminiData,
//       reportId: report._id
//     });

//   } catch (err) {
//     console.error("❌ Upload error:", err);
//     res.status(500).json({ success: false, error: err.message || "Failed to process prescription" });
//   }
// });

// // --- Get reports history ---
// app.get("/api/reports", async (req, res) => {
//   try {
//     const reports = await Report.find().sort({ createdAt: -1 });
//     res.json({ success: true, reports });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // --- Routes ---
// app.use("/api/bot", botRoutes);
// app.use('/api/prescription', prescriptionRoutes);
// app.use("/api", uploadRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/llm', llmRoutes);

// // --- Start server ---
// const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error('❌ MongoDB connection error:', err));



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const botRoutes = require("./routes/botRoutes");
const prescriptionRoutes = require('./routes/prescription');
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const llmRoutes = require('./routes/llm');
const medicinesRoutes = require('./routes/llm'); // or wherever your router is


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Gemini AI client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB schema
const ReportSchema = new mongoose.Schema({
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String, default: "" },
      frequency: { type: String, default: "" },
      duration: { type: String, default: "" },
      instructions: { type: String, default: "" },
      time: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      // ✅ Store suggestions with side effects & cost
      suggestions: [
        {
          name: String,
          dosage: String,
          use: String,
          cost: String,
          how_to_use: String,
          side_effects: String,
          
        }
      ]
    }
  ],
  condition: { type: String, default: "" },
  rawText: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);

// --- Upload prescription + parse OpenAI + Gemini ---
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    let openAIData = { medications: [], condition: "", rawText: "" };
    try {
      // --- First prompt: Parse prescription ---
      const openAIResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
            `
              "You are a medical prescription parser. Always return JSON with fields: medications (array of {name, dose, frequency, duration, instructions}) and condition (string)."
              - "frequency" = how often (e.g. "once", "daily", "weekly")
              `
              
              
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract medicines from this prescription image." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      });

      let text = openAIResp.choices[0].message.content;
      if (text.startsWith("```"))
        text = text.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();

      openAIData = JSON.parse(text);
      openAIData.medications = openAIData.medications || [];
      openAIData.condition = openAIData.condition || "";
      openAIData.rawText = openAIData.rawText || "";

      // --- Second prompt: Add suggestions for each medicine ---
      // --- Second prompt: Add suggestions for each medicine (robust, schema-enforced, retry-safe) ---
      for (let med of openAIData.medications) {
        try {
          // 1) Primary attempt: enforce an object with "suggestions": [...]
          const prompt = `
You are a medical assistant. Output JSON ONLY. Follow this exact schema:

{
  "suggestions": [
    {
      "name": "string",             // generic or brand
      "dosage": "string",           // e.g., "500 mg tablet"
      "use": "string",              // what it treats
      "cost": "string",             // approx range in INR
      "how_to_use": "string",       // short instructions
      "side_effects": "string"      // common side effects
    }
  ]
}

Rules:
- Provide 2–3 items in "suggestions".
- If any field unknown, use "Not specified".
- Do NOT include markdown, code fences, or any prose outside JSON.

Medicine: ${med.name || "Not specified"}
Dose from prescription (if any): ${med.dose || med.dosage || "Not specified"}
`;

          const suggestionResp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.1,
            messages: [
              { role: "system", content: "You generate medicine suggestions. Always return strict JSON per the schema." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });

          let sugText = suggestionResp.choices?.[0]?.message?.content || "";
          if (sugText.startsWith("```")) {
            sugText = sugText.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
          }

          let parsed;
          try {
            parsed = JSON.parse(sugText);
          } catch (e) {
            parsed = null;
          }

          let arr = [];
          if (parsed && Array.isArray(parsed.suggestions)) {
            arr = parsed.suggestions;
          } else if (parsed && Array.isArray(parsed)) {
            arr = parsed; // in case model returned a bare array
          }

          // 2) If primary attempt failed or empty, do a minimal retry (no schema mismatch excuses)
          if (!Array.isArray(arr) || arr.length === 0) {
            const retryPrompt = `
Return ONLY a JSON array of 2 objects, each with:
"name","dosage","use","cost","how_to_use","side_effects".
If unknown, put "Not specified". No markdown.

Medicine: ${med.name || "Not specified"}
`;
            const retryResp = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              temperature: 0.1,
              messages: [
                { role: "system", content: "Return a strict JSON array with the required keys. No extra text." },
                { role: "user", content: retryPrompt }
              ],
              response_format: { type: "json_object" }
            });

            let retryText = retryResp.choices?.[0]?.message?.content || "";
            if (retryText.startsWith("```")) {
              retryText = retryText.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
            }

            try {
              const retryParsed = JSON.parse(retryText);
              if (Array.isArray(retryParsed)) arr = retryParsed;
              else if (retryParsed && Array.isArray(retryParsed.suggestions)) arr = retryParsed.suggestions;
            } catch {
              // swallow; will use fallback
            }
          }

          // 3) Final fallback: never let it be empty
          if (!Array.isArray(arr) || arr.length === 0) {
            arr = [
              {
                name: "Not specified",
                dosage: "Not specified",
                use: "Not specified",
                cost: "Not specified",
                how_to_use: "Not specified",
                side_effects: "Not specified"
              }
            ];
          }

          // 4) Normalize fields & guarantee all keys exist
          med.suggestions = arr.map(sug => ({
            name: (sug && (sug.name ?? sug.brand)) || "Not specified",
            dosage: (sug && sug.dosage) || "Not specified",
            use: (sug && (sug.use || sug.indication)) || "Not specified",
            cost: (sug && sug.cost) || "Not specified",
            how_to_use: (sug && (sug.how_to_use || sug.howToUse)) || "Not specified",
            side_effects: (sug && (sug.side_effects || sug.sideEffects)) || "Not specified"
          }));
        } catch (err) {
          console.error(`❌ Suggestion error for ${med.name}:`, err.message);
          // Last-resort non-empty fallback
          med.suggestions = [
            {
              name: "Not specified",
              dosage: "Not specified",
              use: "Not specified",
              cost: "Not specified",
              how_to_use: "Not specified",
              side_effects: "Not specified"
            }
          ];
        }
      }


    } catch (err) {
      console.error("OpenAI parsing error:", err.message);
    }

    // --- Gemini parsing ---
    let geminiData = { medications: [], condition: "" };

    try {
      const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptParts = [
        {
          text: `
      You are a medical prescription parser.
      Output ONLY valid JSON in this format:
      {
        "medications": [
          {
            "name": "string",
            "dose": "string",
            "frequency": "string",
            "duration": "string",
            "instructions": "string"
          }
        ],
        "condition": "string"
      }
      Do not add explanations or markdown.`
        },
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
      ];

      const result = await model.generateContent(promptParts);
      const response = await result.response;
      let extractedText = response.text();

      // --- Try parsing JSON ---
      try {
        geminiData = JSON.parse(extractedText);
      } catch {
        const match = extractedText.match(/({[\s\S]*})/);
        geminiData = match ? JSON.parse(match[1]) : { medications: [], condition: "" };
      }

      // --- Ensure defaults ---
      geminiData.medications = geminiData.medications || [];
      geminiData.condition = geminiData.condition || "Not specified";

      // --- Add suggestions loop ---
      for (let med of geminiData.medications) {
        try {
          const suggestionPrompt = `
      You are a medical assistant.
      For the medicine "${med.name}", generate AT LEAST 3 suggestions in JSON format.
      Always return an array of 3 or more objects like this:
      [
        {
          "name": "<generic or brand name>",
          "dosage": "<e.g. 500mg tablet>",
          "use": "<what it treats>",
          "cost": "<approx cost range in INR>",
          "how_to_use": "<instructions for taking it>",
          "side_effects": "<common side effects>"
        }
      ]
      Only return JSON, no explanations.
      `;

          const suggResult = await model.generateContent([suggestionPrompt]);
          const suggResponse = await suggResult.response;
          let suggText = suggResponse.text();

          if (suggText.startsWith("```")) {
            suggText = suggText.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();
          }

          let suggData = JSON.parse(suggText);

          // ✅ Ensure array & at least 3
          if (!Array.isArray(suggData)) {
            suggData = [suggData];
          }
          if (suggData.length < 3) {
            // Duplicate last suggestion to pad
            while (suggData.length < 3) {
              suggData.push({ ...suggData[suggData.length - 1] });
            }
          }

          med.suggestions = suggData;

        } catch (err) {
          console.error(`❌ Suggestion error for ${med.name}:`, err.message);
          med.suggestions = [];
        }
      }

      // --- Fallback if still empty ---
      if (!geminiData.medications.length) {
        geminiData = {
          condition: "Not specified",
          medications: [
            {
              name: "Unknown",
              dose: "Not specified",
              frequency: "Not specified",
              duration: "Not specified",
              instructions: "Not specified",
              suggestions: []
            }
          ]
        };
      }

    } catch (err) {
      console.error("Gemini AI error:", err.message);
    }



    // --- Save OpenAI data to MongoDB ---
    const report = new Report({
      medications: openAIData.medications,
      condition: openAIData.condition,
      rawText: openAIData.rawText || "",
    });
    await report.save();

    res.json({
      success: true,
      openAI: openAIData,
      gemini: geminiData,
      reportId: report._id
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to process prescription" });
  }
});

// --- Get reports history ---
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// --- Delete a report by ID ---
app.delete("/api/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Text-to-Speech endpoint ---
app.post("/api/speak", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Text required" });

    // Translate text explicitly to Telugu if lang is 'te' or 'te-IN'
    const translateResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional translator." },
        { role: "user", content: `Translate the following text to ${lang || "English"} ONLY in that language. Do not transliterate: ${text}` }
      ]
    });

    const translatedText = translateResp.choices[0].message.content.trim();

    // Generate speech from translated text
    const audioResp = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: translatedText,
      language: "en-US" // keep 'en-US' here; the text is already in Telugu
    });

    const buffer = Buffer.from(await audioResp.arrayBuffer());
    res.set({ "Content-Type": "audio/mpeg", "Content-Length": buffer.length });
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// --- Medicine image recognition ---
// app.post("/api/medicine-info", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No image uploaded" });
//     }

//     const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

//     // Ask OpenAI Vision model
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a medical assistant. Identify the medicine from an image 
// and return details in structured JSON with fields:

// {
//   "name": "string",
//   "uses": "string",
//   "cost": "string",
//   "how_to_use": "string",
//   "side_effects": "string"
// }

// If unclear, guess the closest possible medicine but keep the JSON format.
// `
//         },
//         {
//           role: "user",
//           content: [
//             { type: "text", text: "Identify this medicine and provide details." },
//             {
//               type: "image_url",
//               image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
//             }
//           ]
//         }
//       ],
//       response_format: { type: "json_object" }
//     });

//     let text = response.choices[0].message.content;
//     if (text.startsWith("```")) {
//       text = text.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();
//     }

//     let medicineInfo = {};
//     try {
//       medicineInfo = JSON.parse(text);
//     } catch {
//       medicineInfo = {
//         name: "Unknown",
//         uses: "Not specified",
//         cost: "Not specified",
//         how_to_use: "Not specified",
//         side_effects: "Not specified"
//       };
//     }

//     fs.unlinkSync(req.file.path); // cleanup
//     res.json({ success: true, medicine: medicineInfo });

//   } catch (err) {
//     console.error("❌ Medicine recognition error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

app.post("/api/medicine-info", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Ask OpenAI Vision model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a medical assistant. Identify the medicine from an image 
and return details in structured JSON with fields:

{
  "name": "string",
  "uses": "string",
  "cost": "string",
  "how_to_use": "string",
  "side_effects": "string"
}

Guidelines:

- Each field should be a full descriptive sentence or multiple sentences.
- The "uses" field should explain all common indications in 2–4 sentences.
  Example: "This medicine is commonly used to relieve headache, reduce fever, and ease body pain. It can also be helpful in minor inflammations. Avoid taking it on an empty stomach."
- The "side_effects" field should list common side effects in 2–4 sentences.
  Example: "Some people may experience nausea, dizziness, or mild stomach upset. Rarely, allergic reactions can occur. Always follow dosage instructions to minimize risks."
- The "cost" field should be in Indian Rupees, phrased naturally, e.g., "The approximate cost of this medicine in India is ₹250."
If unclear, guess the closest possible medicine but keep the JSON format.
`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this medicine and provide details." },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    let text = response.choices[0].message.content;
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();
    }

    let medicineInfo = {};
    try {
      medicineInfo = JSON.parse(text);
    } catch {
      medicineInfo = {
        name: "Unknown",
        uses: "Not specified",
        cost: "Not specified",
        how_to_use: "Not specified",
        side_effects: "Not specified"
      };
    }

    // ✅ Dangerous keywords check
    const dangerousList = [
      "poison", "cyanide", "pesticide", "arsenic", "rat killer",
      "mercury", "toxin", "venom", "overdose", "snake poison"
    ];

    const isDangerous = dangerousList.some(word =>
      (medicineInfo.name || "").toLowerCase().includes(word) ||
      (medicineInfo.uses || "").toLowerCase().includes(word)
    );

    if (isDangerous) {
      medicineInfo = {
        name: medicineInfo.name || "Dangerous Substance",
        warning: "⚠️ This is very dangerous. I cannot provide details for safety reasons."
      };
    }

    fs.unlinkSync(req.file.path); // cleanup
    res.json({ success: true, medicine: medicineInfo });

  } catch (err) {
    console.error("❌ Medicine recognition error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});






// --- Routes ---
app.use("/api/bot", botRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use("/api", uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/medicines', medicinesRoutes);
const chatRoutes = require("./routes/botRoutes");
app.use("/api", chatRoutes);

const trustedRoutes = require("./routes/trustedRoutes");
app.use("/api/trusted",trustedRoutes);

const reminderRoutes = require('./routes/reminderRoutes');
app.use('/api', reminderRoutes);

const { checkMissedMedicines } = require("./scheduler/reminderScheduler");
console.log("🟢 Scheduler started, will check missed medicines every 1 min");

// Run immediately once for testing
checkMissedMedicines().catch(err => console.error("Scheduler initial run error:", err));

// Then run every 1 minute
setInterval(() => {
  checkMissedMedicines().catch(err => console.error("Scheduler run error:", err));
}, 60 * 1000);
const medicineStatusRoutes = require("./routes/medicineStatus");
app.use("/api/medicine-status", medicineStatusRoutes);

// Cron Jobs (⚡ important)
require("./jobs/medicineScheduler");

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// const medStatusRoutes = require('./routes/medicineStatus');
// app.use('/api/medicine-status', medStatusRoutes);




// app.use("/api/trusted", require("./routes/trustedRoutes"));

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);







// --- Start server ---
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
