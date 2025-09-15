const express = require("express");
const multer = require("multer");
const path = require("path");
const Tesseract = require("tesseract.js"); // OCR

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// // Helper: Extract medicines and condition from text
// function parsePrescriptionText(text) {
//   let medicines = [];
//   let condition = "Not detected";

//   // Example: match lines with common medicine patterns
//   const medicineRegex = /(Paracetamol|Amoxicillin|Lisinopril|Ibuprofen|Cetirizine|Metformin|Aspirin)\s*([\d]+mg)?/gi;
//   let match;
//   while ((match = medicineRegex.exec(text)) !== null) {
//     medicines.push(match[0]);
//   }

//   // Example: detect conditions
//   if (/fever|infection|cough|diabetes|hypertension/i.test(text)) {
//     if (/fever/i.test(text)) condition = "Fever";
//     else if (/infection/i.test(text)) condition = "Infection";
//     else if (/cough/i.test(text)) condition = "Cough";
//     else if (/diabetes/i.test(text)) condition = "Diabetes";
//     else if (/hypertension/i.test(text)) condition = "Hypertension";
//   }

//   return { medicines, condition };
// }
// Helper: Extract medicines and condition from text
function parsePrescriptionText(text) {
  let medicines = [];
  let condition = "Not detected";

  // Normalize text
  const cleanText = text.replace(/\r/g, "").split("\n").map(l => l.trim()).filter(l => l);

  let currentMed = null;

  cleanText.forEach(line => {
    if (/^medication[:\-]/i.test(line)) {
      // Save previous medicine if exists
      if (currentMed) medicines.push(currentMed);

      currentMed = {
        name: line.replace(/medication[:\-]/i, "").trim(),
        dosage: "Not specified",
        frequency: "Not specified",
        quantity: "Not specified",
        refills: "Not specified",
        instructions: "Not specified",
      };
    } else if (/^dosage[:\-]/i.test(line)) {
      if (currentMed) {
        currentMed.dosage = line.replace(/dosage[:\-]/i, "").trim();
        currentMed.instructions = currentMed.dosage; // treat dosage text as instructions too
        // Extract frequency if present
        const freqMatch = line.match(/every\s+\d+\s*(hours|days)/i);
        if (freqMatch) currentMed.frequency = freqMatch[0];
      }
    } else if (/^quantity[:\-]/i.test(line)) {
      if (currentMed) {
        currentMed.quantity = line.replace(/quantity[:\-]/i, "").trim();
      }
    } else if (/^refills[:\-]/i.test(line)) {
      if (currentMed) {
        currentMed.refills = line.replace(/refills[:\-]/i, "").trim();
      }
    }
  });

  // Push last medicine if exists
  if (currentMed) medicines.push(currentMed);

  // Detect condition (look for "Diagnosis:" or "Condition:")
  const diagnosisMatch = text.match(/diagnosis[:\-]?\s*(.*)/i);
  if (diagnosisMatch) {
    condition = diagnosisMatch[1].trim();
  }

  return { medicines, condition };
}



// POST /api/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Run OCR on the uploaded image
    const result = await Tesseract.recognize(req.file.path, "eng");

    const extractedText = result.data.text;
    console.log("OCR Output:", extractedText);

    // Parse prescription text
    const { medicines, condition } = parsePrescriptionText(extractedText);

    res.json({
      message: "Prescription uploaded successfully",
      extracted: medicines,
      condition: condition,
      rawText: extractedText, // send raw text too for debugging
    });

     // ⚠️ Make sure you have userId from auth or use a dummy one
    const userId = req.user ? req.user._id : "68ad56a15462b4b15beab0fb"; // replace with actual userId
    const savedMedicines = [];
    for (const med of medicines) {
      const newMed = new Medicine({ ...med, userId });
      await newMed.save();
      savedMedicines.push(newMed);
    }

    res.json({
      message: "Prescription uploaded and saved successfully",
      extracted: savedMedicines,
      condition,
      rawText: extractedText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process prescription" });
  }
});

module.exports = router;
