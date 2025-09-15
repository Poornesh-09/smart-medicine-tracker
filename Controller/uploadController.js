const fs = require("fs");
const Tesseract = require("tesseract.js"); // OCR
const Reminder = require("../models/Medicine");

exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Run OCR on uploaded image
    const result = await Tesseract.recognize(req.file.path, "eng");
    const text = result.data.text;

    console.log("Extracted text:", text);

    // Simple regex extraction (improve later)
    const medicines = text.match(/[A-Za-z]+/g) || [];

    // Example auto-set reminder
    const reminders = medicines.map(med => ({
      name: med,
      doses: [{ time24: "09:00", beforeAfterMeal: "after" }]
    }));

    // Save reminders
    await Reminder.insertMany(reminders);

    // Patient condition detection (toy logic)
    let condition = "General Checkup";
    if (text.toLowerCase().includes("fever")) condition = "Fever";
    if (text.toLowerCase().includes("cough")) condition = "Cold/Cough";

    res.json({
      message: "Prescription processed",
      extracted: medicines,
      condition,
      reminders
    });

    fs.unlinkSync(req.file.path); // cleanup file
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing prescription" });
  }
};
