const mongoose = require("mongoose");

const medicineStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",  index: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine"}, // link to Medicine
  medicineName: { type: String }, // keep name in case medicine is deleted
  doseTime: { type: String, }, // e.g. "09:00"
  status: { type: String, enum: ["taken", "not_taken"], default: "not_taken", required: true },
  timestamp: { type: Date, default: Date.now }, // when the user responded
  notified: { type: Boolean, default: false }
});

module.exports = mongoose.model("MedicineStatus", medicineStatusSchema);
