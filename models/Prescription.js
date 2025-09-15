const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [medicineSchema],                         // List of medicines
  condition: { type: String },                         // e.g., "Hypertension"
  rawText: { type: String },                           // OCR raw text
  dateUploaded: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);


// const mongoose = require("mongoose");

// // Define medicine schema
// // const medicineSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   dosage: { type: String },
// //   frequency: { type: String },
// //   instructions: { type: String },
// // });

// // Define prescription schema
// const PrescriptionSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   file: String,
//   ocrText: String,
//   extractedData: Object, // can store array of medicines, condition, etc.
// }, { timestamps: true });

// // Export the model using the correct schema variable
// module.exports = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
