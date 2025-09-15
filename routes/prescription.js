const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const controller = require('../Controller/prescriptionController');

// store files to backend/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// Upload prescription (authenticated). If you want public uploads remove `auth`.
router.post('/upload', auth, upload.single('file'), controller.handleUpload);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const Tesseract = require('tesseract.js');
// const OpenAI = require('openai');
// const auth = require('../middleware/auth'); // your auth middleware

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Multer storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });

// const upload = multer({ storage });

// // Upload prescription and extract medicines
// router.post('/upload', auth, upload.single('prescription'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'Prescription file is required' });

//     const filePath = req.file.path;

//     // Step 1: OCR with Tesseract
//     const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
//       logger: m => console.log(m)
//     });

//     console.log('OCR Text:', text);

//     // Step 2: Send OCR text to GPT for structured extraction
//     const gptResponse = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         {
//           role: 'user',
//           content: `
// You are a medical assistant. Extract all medicine names, dosage, frequency, and instructions from the following prescription text. 
// Return ONLY JSON in this format:

// {
//   "medicines": [
//     {
//       "name": "Medicine Name",
//       "dosage": "Dosage info",
//       "frequency": "Frequency info",
//       "instructions": "Other instructions"
//     }
//   ],
//   "condition": "Detected condition or leave empty"
// }

// Prescription text:
// ${text}
// `
//         }
//       ]
//     });

//     let extractedText = gptResponse.choices[0].message.content;

//     // Step 3: Clean GPT response from ```json or ``` backticks
//     extractedText = extractedText.replace(/```(json)?/g, '').trim();

//     // Step 4: Parse JSON
//     const extractedData = JSON.parse(extractedText);

//     // Step 5: Optionally save to MongoDB (example)
//     const Prescription = require('../models/prescription.model');
//     const newPrescription = new Prescription({
//       user: req.user.id,
//       file: req.file.filename,
//       ocrText: text,
//       extractedData
//     });
//     await newPrescription.save();

//     // Step 6: Respond with structured data
//     res.json({ success: true, data: extractedData });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;
