const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const MedicineStatus = require('../models/MedicineStatus');

// create from LLM structured payload or manual
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body;
    const doc = new Medicine({ userId: req.user.id, ...payload });
    await doc.save();
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message}); }
});

// get all for user
// router.get('/', auth, async (req, res) => {
//   try {
//     const meds = await Medicine.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     const medicinestatus = await MedicineStatus.find({userId: meds.useid, medicineId:meds.id})
//     res.json(meds);
//   } catch (e) { res.status(500).json({ error: e.message}); }
// });


// assumed imports at top of file
// const express = require('express');
// const router = express.Router();
// const auth = require('./middleware/auth');
// const Medicine = require('./models/Medicine');
// const MedicineStatus = require('./models/MedicineStatus');

// router.get('/', auth, async (req, res) => {
//   try {
//     // 1) fetch all meds for this user
//     const meds = await Medicine.find({ userId: req.user.id }).sort({ createdAt: -1 });

//     // if no meds, return early
//     if (!meds || meds.length === 0) return res.json([]);

//     // 2) collect medicine ids
//     const medicineIds = meds.map(m => m._id);

//     // 3) fetch statuses for these medicines for this user, most recent first
//     // assuming MedicineStatus has fields: medicineId, userId, status, createdAt (or updatedAt)
//     const statuses = await MedicineStatus.find({
//       userId: req.user.id,
//       medicineId: { $in: medicineIds }
//     }).sort({ createdAt: -1 });

//     // 4) reduce statuses to the latest status per medicineId
//     const latestStatusByMedId = statuses.reduce((map, s) => {
//       const mid = String(s.medicineId);
//       if (!map[mid]) map[mid] = s; // because statuses sorted desc, first seen is latest
//       return map;
//     }, {});

//     // 5) attach status to each medicine
//     // convert Mongoose docs to plain objects so client can mutate if needed
//     const medsWithStatus = meds.map(m => {
//       const obj = m.toObject ? m.toObject() : { ...m };
//       const statusDoc = latestStatusByMedId[String(m._id)] || null;
//       // attach whichever fields you want — here I'm attaching full status doc and a short status value
//       obj.status = statusDoc ? statusDoc.status: null;
//       // optionally include the raw status doc:
//       // obj.statusRaw = statusDoc || null;
//       return obj;
//     });

//     // 6) send response
//     res.json(medsWithStatus);

//   } catch (e) {
//     console.error('GET /meds error:', e);
//     res.status(500).json({ error: e.message });
//   }
// });

const mongoose = require('mongoose');

// Helper: safely normalize an id to an ObjectId if possible, otherwise keep a string
function normalizeId(id) {
  if (id === null || id === undefined) return id;
  if (id instanceof mongoose.Types.ObjectId) return id;
  if (mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(String(id));
  return String(id);
}

router.get('/', auth, async (req, res) => {
  try {
    // normalize user id
    const userId = normalizeId(req.user.id);

    // 1) Fetch medicines for this user
    const meds = await Medicine.find({ userId }).sort({ createdAt: -1 }).lean();
    if (!meds || meds.length === 0) {
      return res.json([]);
    }

    // 2) Collect medicine IDs (normalized)
    const medicineIds = meds.map(m => normalizeId(m._id));

    // 3) Fetch statuses (your documents use "timestamp", not "createdAt")
    const statuses = await MedicineStatus.find({
      userId,
      medicineId: { $in: medicineIds }
    })
      .sort({ timestamp: -1 })
      .lean();

    // 4) Group by medicineId → pick latest
    const latestByMed = {};
    for (const s of statuses) {
      const key = String(s.medicineId);
      if (!latestByMed[key]) {
        latestByMed[key] = s; // first one is latest due to sort
      }
    }

    // 5) Attach latest status to each med — DEFAULT to 'not_taken' when missing
    const medsWithStatus = meds.map(m => {
      const key = String(m._id);
      const st = latestByMed[key] || null;

      return {
        ...m,
        status: st ? st.status : 'not_taken',
        statusIsDefault: st ? false : true,
        statusMeta: st ? { doseTime: st.doseTime, timestamp: st.timestamp } : null
      };
    });

    res.json(medsWithStatus);
  } catch (err) {
    console.error('GET /meds error', err && (err.stack || err));
    res.status(500).json({ error: err.message });
  }
});



// delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message}); }
});

// // GET today's reminders for the logged-in user
// router.get('/today', auth, async (req, res) => {
//   try {
//     const meds = await Medicine.find({ userId: req.user.id });

//     // Only return doses for today
//     const todayReminders = meds.map(med => {
//       return {
//         name: med.name,
//         doses: med.doses || [],
//         shape: med.shape,
//         color: med.color,
//       };
//     });

//     res.json(todayReminders);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch today's reminders" });
//   }
// });
// GET today's reminders for the logged-in user
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    const todayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const startOfToday = new Date(today.toDateString()); // midnight today
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1); // midnight tomorrow

    const meds = await Medicine.find({
      userId: req.user.id,
      $or: [
        // 🟢 Daily
        {
          frequency: "daily",
          startDate: { $lte: endOfToday },
          $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }]
        },
        // 🟢 Weekly
        {
          frequency: "weekly",
          daysOfWeek: todayName,
          startDate: { $lte: endOfToday },
          $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }]
        },
        // 🟢 Once
        {
          frequency: "once",
          startDate: { $gte: startOfToday, $lt: endOfToday }
        }
      ]
    });

    // Only return required fields
    const todayReminders = meds.map(med => ({
      _id: med._id,
      name: med.name,
      dosage: med.dosage,
      doses: med.doses || [],
      shape: med.shape,
      color: med.color,
      frequency: med.frequency,
      daysOfWeek: med.daysOfWeek,
      startDate: med.startDate,
    }));

    res.json(todayReminders);
  } catch (err) {
    console.error("❌ Error fetching today's reminders:", err);
    res.status(500).json({ error: "Failed to fetch today's reminders" });
  }
});


// ✅ Add new medicine (linked to logged-in user)
// router.post("/", auth, async (req, res) => {
//   try {
//     const medicine = new Medicine({
//       ...req.body,
//       userId: req.user.userId, // from decoded token
//     });
//     await medicine.save();
//     res.json(medicine);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// ✅ Add new medicine (linked to logged-in user)
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      strength,
      dosage,
      beforeAfterMeal,
      startDate,
      time,
      medicineColor,
      medicineShape,
    } = req.body;

    if (!name || !dosage || !time || !startDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert time (HH:mm) + startDate → JS Date
    const [hours, minutes] = time.split(":").map(Number);
    const doseDate = new Date(startDate);
    doseDate.setHours(hours, minutes, 0, 0);

    const medicine = new Medicine({
      userId: req.user.id, // from auth middleware
      medicineName: name,
      strength,
      dosage,
      beforeAfterMeal: beforeAfterMeal || "any",
      startDate,
      doseTime: doseDate,
      color: medicineColor || "#FFFFFF",
      shape: medicineShape || "round",
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all medicines for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.userId });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// edit/update medicine
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find medicine only if it belongs to the logged-in user
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: id, userId: req.user.id },   // condition
      { $set: req.body },                 // fields to update
      { new: true, runValidators: true }  // return updated doc & validate schema
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found or not authorized' });
    }

    res.json(updatedMedicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // PUT /api/medicines/:id/status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const medicine = await Medicine.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.id },
//       { $set: { status } },
//       { new: true }
//     );
//     if (!medicine) return res.status(404).json({ error: "Medicine not found" });
//     res.json(medicine);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });





module.exports = router;
