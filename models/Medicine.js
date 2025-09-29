const mongoose = require('mongoose');

const doseSchema = new mongoose.Schema({
  time24: String,             // "09:00"
  beforeAfterMeal: { type:String, default: 'any' },  // before|after|any
  notified: { type: Boolean, default: false }
});

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true, index:true },
  name: { type: String, required: true },
  strength: String,
  dosage: { type: String},   // "1 tablet"
  frequency: { type: String},
  daysOfWeek: [String],
  startDate: Date,
  endDate: Date,
  doses: [doseSchema],
  notes: String,
  color: { type: String},
  shape: { type: String},
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [medicineSchema],                         // List of medicines
  condition: { type: String },                         // e.g., "Hypertension"
  rawText: { type: String },                           // OCR raw text
  dateUploaded: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);

module.exports = mongoose.model('Medicine', medicineSchema);

// const mongoose = require("mongoose");

// const medicineSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   dosage: { type: String },
//   frequency: { type: String },
//   instructions: { type: String },
// });
// module.exports = mongoose.model('Medicine', medicineSchema);



