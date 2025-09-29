// utils/medicineStatusHelper.js
const MedicineStatus = require("../models/MedicineStatus");

/**
 * Upsert a missed dose status WITHOUT touching "taken".
 */
async function upsertMissedDose({ userId, medicineId, medicineName, doseTime }) {
  return MedicineStatus.findOneAndUpdate(
    {
      userId,
      medicineId,
      doseTime
    },
    {
      $setOnInsert: {
        medicineName: medicineName || "medicine",
        status: "not_taken",
        timestamp: new Date(),
        notified: false
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * Mark a dose as notified WITHOUT touching status.
 */
async function markDoseNotified({ userId, medicineId, doseTime }) {
  return MedicineStatus.updateOne(
    {
      userId,
      medicineId,
      doseTime,
      status: { $ne: "taken" } // never overwrite "taken"
    },
    { $set: { notified: true } }
  );
}

module.exports = { upsertMissedDose, markDoseNotified };
