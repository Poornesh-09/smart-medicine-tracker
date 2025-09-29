// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   trustedId: { type: mongoose.Schema.Types.ObjectId, ref: "TrustedMember" }, // trusted person
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },             // patient
//   medicineName: String,
//   doseTime: String,
//   message: String,
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Notification", notificationSchema);

// --- FILE: server/models/Notification.js ---
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  trustedId: { type: mongoose.Schema.Types.ObjectId, ref: "TrustedMember", required: true }, // trusted person
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },             // patient
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },                    // optional link to medicine
  medicineName: { type: String },                                                            // human-friendly name
  doseTime: { type: Date },                                                                  // keep as Date for proper sorting
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// index to speed up duplicate detection (trusted-user-medicine-dose)
notificationSchema.index({ trustedId: 1, userId: 1, medicineId: 1, doseTime: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

