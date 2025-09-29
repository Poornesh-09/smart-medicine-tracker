// const express = require("express");
// const MedicineStatus = require("../models/MedicineStatus");
// const { verifyToken } = require("../middleware/auth"); // assuming you use JWT

// const router = express.Router();

// // Save medicine status
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const { userId, medicineId, medicineName, doseTime, status } = req.body;

//     if (!userId || !medicineId || !doseTime || !status) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     const log = new MedicineStatus({
//       userId,
//       medicineId,
//       medicineName,
//       doseTime,
//       status,
//     });

//     await log.save();

//     res.json({ success: true, message: "Medicine status saved", data: log });
//   } catch (err) {
//     console.error("Error saving medicine status:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Fetch all logs for a user
// router.get("/:userId", verifyToken, async (req, res) => {
//   try {
//     const logs = await MedicineStatus.find({ userId: req.params.userId }).sort({ timestamp: -1 });
//     res.json({ success: true, data: logs });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const MedicineStatus = require("../models/MedicineStatus");

const router = express.Router();

// ✅ Save medicine status (Taken / Not Taken)
const mongoose = require('mongoose');

// router.post("/", async (req, res) => {
//   try {
//     const { userId, medicineId, medicineName, doseTime, status } = req.body;

//     if (!userId || !medicineName || !doseTime || !status) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     const log = new MedicineStatus({
//     //    userId: new mongoose.Types.ObjectId(userId),  
//     //   medicineId: medicineId ? mongoose.Types.ObjectId(medicineId) : undefined,
//     userId: new mongoose.Types.ObjectId(req.body.userId),
//     medicineId: new mongoose.Types.ObjectId(req.body.medicineId),
//       medicineName,
//       doseTime,
//       status
//     });

//     await log.save();
//     res.json({ success: true, message: "Medicine status saved", data: log });
//   } catch (err) {
//     console.error("Error saving medicine status:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// ✅ Save medicine status (Taken / Not Taken)
router.post("/", async (req, res) => {
  try {
    const { userId, medicineId, medicineName, doseTime, status } = req.body;

    if (!userId || !medicineName || !doseTime || !status) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 🔑 Ensure unique entry: userId + medicineId + doseTime
    const log = await MedicineStatus.findOneAndUpdate(
      { userId, medicineId, doseTime },  // query
      {
        $set: {
          medicineName,
          status,
          timestamp: new Date(), // update latest
        },
      },
      { new: true, upsert: true } // create if not exists
    );

    res.json({ success: true, message: "Medicine status saved/updated", data: log });
  } catch (err) {
    console.error("Error saving medicine status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ✅ Fetch all logs for a user
router.get("/:userId", async (req, res) => {
  try {
    const logs = await MedicineStatus.find({ userId: req.params.userId }).sort({
      timestamp: -1,
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// server/routes/medicineStatus.js
const auth = require('../middleware/auth');
const Notification = require('../models/Notification'); // optional cleanup

// Upsert status to "taken" for a specific user+medicine+doseTime
// router.put('/mark-taken', auth, async (req, res) => {
//   try {
//     const actorId = req.user.id; // logged-in user id (from auth middleware)
//     const { userId, medicineId, doseTime, medicineName } = req.body;

//     // if (!userId || !medicineId || !doseTime) {
//     //   return res.status(400).json({ success: false, message: 'Missing fields (userId, medicineId, doseTime required)' });
//     // }

//     // Authorization:
//     // allow the owner to mark their own doses
//     // optionally allow trusted members (if req.user.isTrusted or you check TrustedMember)
//     // if (actorId !== userId && !req.user.isTrusted) {
//     //   // adjust this logic if you want trusted members to mark as taken
//     //   return res.status(403).json({ success: false, message: 'Not authorized to mark this dose' });
//     // }

//     const query = {
//   userId: new mongoose.Types.ObjectId(userId),
//   medicineId: new mongoose.Types.ObjectId(medicineId),
//   doseTime: String(doseTime)
// };

//     const update = {
//       $set: {
//         medicineName: medicineName || undefined,
//         status: 'taken',
//         timestamp: new Date(),
//         notified: true
//       }
//     };

//     const opts = { new: true, upsert: true };
//     const doc = await MedicineStatus.findOneAndUpdate(query, update, opts).lean();

//     // Optional: remove notifications for this user+medicine+doseTime
//     try {
//       await Notification.deleteMany({
//         userId: mongoose.Types.ObjectId(userId),
//         medicineId: mongoose.Types.ObjectId(medicineId),
//         doseTime: String(doseTime)
//       });
//     } catch (err) {
//       console.warn('Notification cleanup failed:', err.message);
//     }

//     return res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('PUT /medicine-status/mark-taken error:', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// routes/medicineStatusRoutes.js

// Mark a dose as taken
// backend/routes/medicineStatusRoutes.js


// Helper to safely convert to ObjectId
const { toObjectId } = require('../utils/objectIdHelper');

// Mark medicine as taken
router.put('/mark-taken', auth, async (req, res) => {
  try {
    const { medicineId, doseTime } = req.body;
    const userId = req.user.id;

    if (!medicineId || !doseTime)
      return res.status(400).json({ success: false, error: "Missing medicineId or doseTime" });

    const statusDoc = await MedicineStatus.findOneAndUpdate(
      {
        userId: toObjectId(userId),
        medicineId: toObjectId(medicineId),
        doseTime
      },
      { $set: { status: "taken", timestamp: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Medicine status saved/updated", data: statusDoc });
  } catch (err) {
    console.error("Error marking medicine as taken:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const User = require('../models/User'); // Add this line
const TrustedMember = require('../models/TrustedMember');
const { sendNotificationToTrusted } = require('../utils/notifications'); // Add this line


// Handle missed dose & notify trusted once
router.post('/missed-dose', auth, async (req, res) => {
  try {
    const { medicineId,medicineName, doseTime } = req.body;
    const userId = req.user.id;

    if (!medicineId || !doseTime)
      return res.status(400).json({ success: false, error: "Missing medicineId or doseTime" });

    // ✅ Find or create MedicineStatus
    const statusDoc = await MedicineStatus.findOneAndUpdate(
      {
        userId: toObjectId(userId),
        medicineId: toObjectId(medicineId),
        doseTime
      },
      {
        $setOnInsert: {
          status: "not_taken",
          notified: false,
          timestamp: new Date()
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Send notification **only if not already sent**
    if (!statusDoc.notified) {
      const user = await User.findById(userId).select("name").lean();
      const patientName = user?.name || "your family member";

      const trustedMembers = await TrustedMember.find({ user: userId }).limit(3).lean();
      for (const tm of trustedMembers) {
        try {
          await sendNotificationToTrusted(
            tm.email,
            tm.name,
            medicineName, // optional: pass medicine name if needed
            doseTime,
            patientName,
            tm.mobile,
          );
        } catch (err) {
          console.error("Error notifying trusted member:", err);
        }
      }

      // Mark notified = true
      statusDoc.notified = true;
      await statusDoc.save();
    }

    res.json({ success: true, message: "Missed dose handled", data: statusDoc });
  } catch (err) {
    console.error("Failed handling missed dose:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});




module.exports = router;
