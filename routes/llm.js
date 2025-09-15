// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const OpenAI = require('openai');
// const Medicine = require('../models/Medicine'); // assuming you have a Medicine model in MongoDB

// const LLM_MODEL = 'gpt-4o-mini';
// const TZ = process.env.TZ || 'Asia/Kolkata';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // helper to call LLM
// async function callLLM(messages, temperature = 0.2) {
//   const resp = await openai.chat.completions.create({
//     model: LLM_MODEL,
//     messages,
//     temperature,
//   });
//   return resp;
// }

// // parse natural language schedule -> strict JSON
// router.post('/parse', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
//     const system = `
// You convert natural-language medicine reminder instructions into STRICT JSON.
// Output ONLY a JSON object, no prose. Use user's timezone ${TZ}.
// Schema:
// {
//  "name":"string",
//  "strength":"string|null",
//  "dosage":"string",
//  "frequency":"daily|weekly|custom",
//  "daysOfWeek":["Mon","Tue"...],
//  "doses":[{"time24":"HH:MM","beforeAfterMeal":"before|after|any"}],
//  "startDate":"YYYY-MM-DD",
//  "endDate":"YYYY-MM-DD|null",
//  "notes":"string|null"
// }
// Rules:
// - Convert AM/PM to 24h HH:MM.
// - If no startDate, set to today.
// - If frequency not explicit, default to daily.
// - Return valid JSON only.
//     `;
//     const user = `Instruction: """${text}"""`;
//     const result = await callLLM(
//       [
//         { role: 'system', content: system },
//         { role: 'user', content: user },
//       ],
//       0.1
//     );

//     const respText = result.choices?.[0]?.message?.content ?? '{}';
//     const parsed = JSON.parse(respText);
//     res.json(parsed);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'LLM parse failed', detail: e.message });
//   }
// });

// // friendly reminder text
// router.post('/reminder-text', auth, async (req, res) => {
//   try {
//     const { name, dosage, beforeAfterMeal = 'any', time24 } = req.body;
//     const system = `You are a concise reminder writer. Provide a one-line friendly reminder including med name, dosage, meal context (if any) and time.`;
//     const user = `Medicine: ${name}, Dosage: ${dosage}, Meal:${beforeAfterMeal}, Time:${time24}`;

//     const result = await callLLM(
//       [
//         { role: 'system', content: system },
//         { role: 'user', content: user },
//       ],
//       0.4
//     );

//     const text = result.choices?.[0]?.message?.content?.trim();
//     res.json({ text });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'LLM reminder failed', detail: e.message });
//   }
// });

// // NEW: check pending medicines today
// router.get('/pending', auth, async (req, res) => {
//   try {
//     const today = new Date().toISOString().split('T')[0];

//     // fetch today's pending meds from DB
//     const pendingMeds = await Medicine.find({
//       userId: req.user.id,
//       startDate: { $lte: today },
//       $or: [{ endDate: null }, { endDate: { $gte: today } }],
//       // you can also add a flag like { taken: false } for doses
//     });

//     if (!pendingMeds.length) {
//       return res.json({ reply: "No pending medicines today 🎉" });
//     }

//     const medsList = pendingMeds.map(m => `${m.name} (${m.dosage})`).join(", ");

//     const system = `You are a medicine assistant. The user asked if they have any pending medicines today. Respond in a polite, short, natural way.`;
//     const user = `Pending medicines today: ${medsList}`;
    
//     const result = await callLLM(
//       [
//         { role: 'system', content: system },
//         { role: 'user', content: user },
//       ],
//       0.3
//     );

//     const reply = result.choices?.[0]?.message?.content?.trim();
//     res.json({ reply, pending: pendingMeds });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Pending check failed', detail: e.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');
const Medicine = require('../models/Medicine'); // assuming you have a Medicine model in MongoDB

const LLM_MODEL = 'gpt-4o-mini';
const TZ = process.env.TZ || 'Asia/Kolkata';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// helper to call LLM
async function callLLM(messages, temperature = 0.2) {
  const resp = await openai.chat.completions.create({
    model: LLM_MODEL,
    messages,
    temperature,
  });
  return resp;
}

// parse natural language schedule -> strict JSON
router.post('/parse', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const system = `
You convert natural-language medicine reminder instructions into STRICT JSON.
Output ONLY a JSON object, no prose. Use user's timezone ${TZ}.
Schema:
{
 "name":"string",
 "strength":"string|null",
 "dosage":"string",
 "frequency":"daily|weekly|custom",
 "daysOfWeek":["Mon","Tue"...],
 "doses":[{"time24":"HH:MM","beforeAfterMeal":"before|after|any"}],
 "startDate":"YYYY-MM-DD",
 "endDate":"YYYY-MM-DD|null",
 "notes":"string|null"
}
Rules:
- Convert AM/PM to 24h HH:MM.
- If no startDate, set to today.
- If frequency not explicit, default to daily.
- Return valid JSON only.
    `;
    const user = `Instruction: """${text}"""`;
    const result = await callLLM(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      0.1
    );

    const respText = result.choices?.[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(respText);
    res.json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'LLM parse failed', detail: e.message });
  }
});

// friendly reminder text
router.post('/reminder-text', auth, async (req, res) => {
  try {
    const { name, dosage, beforeAfterMeal = 'any', time24 } = req.body;
    const system = `You are a concise reminder writer. Provide a one-line friendly reminder including med name, dosage, meal context (if any) and time.`;
    const user = `Medicine: ${name}, Dosage: ${dosage}, Meal:${beforeAfterMeal}, Time:${time24}`;

    const result = await callLLM(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      0.4
    );

    const text = result.choices?.[0]?.message?.content?.trim();
    res.json({ text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'LLM reminder failed', detail: e.message });
  }
});

// NEW: check pending medicines today
router.get('/pending', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // fetch today's pending meds from DB
    const pendingMeds = await Medicine.find({
      userId: req.user.id,
      startDate: { $lte: today },
      $or: [{ endDate: null }, { endDate: { $gte: today } }],
    });

    if (!pendingMeds.length) {
      return res.json({ reply: "No pending medicines today 🎉" });
    }

    const medsList = pendingMeds.map(m => `${m.name} (${m.dosage})`).join(", ");

    const system = `You are a medicine assistant. The user asked if they have any pending medicines today. Respond in a polite, short, natural way.`;
    const user = `Pending medicines today: ${medsList}`;
    
    const result = await callLLM(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      0.3
    );

    const reply = result.choices?.[0]?.message?.content?.trim();
    res.json({ reply, pending: pendingMeds });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Pending check failed', detail: e.message });
  }
});

// NEW: suggestions for a medicine
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Medicine name required" });

  const system = `
You are a medicine assistant AI. For the given medicine name, provide up to 3 distinct alternative medicines available in India with similar effect.
For each medicine include:
- Name
- Dosage
- Use
- Cost (in Indian Rupees)
- How to use
- Side effects
Output only a JSON array like:
[
  {
    "name": "...",
    "dosage": "...",
    "use": "...",
    "cost": "₹...",
    "how_to_use": "...",
    "side_effects": "..."
  }
]
Ensure that all suggestions are different from each other.
`;


    const user = `Medicine: "${name}"`;

    const result = await callLLM(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      0.3
    );

    // Parse response safely
    let suggestions = [];
    try {
      suggestions = JSON.parse(result.choices?.[0]?.message?.content ?? "[]");
    } catch {
      suggestions = [];
    }

    res.json({ suggestions });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'LLM suggestions failed', detail: e.message });
  }
});


module.exports = router;

