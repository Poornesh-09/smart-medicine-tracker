const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');

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
router.get('/', auth, async (req, res) => {
  try {
    const meds = await Medicine.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(meds);
  } catch (e) { res.status(500).json({ error: e.message}); }
});

// delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message}); }
});

// // GET today's reminders for the logged-in user
router.get('/today', auth, async (req, res) => {
  try {
    const meds = await Medicine.find({ userId: req.user.id });

    // Only return doses for today
    const todayReminders = meds.map(med => {
      return {
        name: med.name,
        doses: med.doses || []
      };
    });

    res.json(todayReminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch today's reminders" });
  }
});

// ✅ Add new medicine (linked to logged-in user)
router.post("/", auth, async (req, res) => {
  try {
    const medicine = new Medicine({
      ...req.body,
      userId: req.user.userId, // from decoded token
    });
    await medicine.save();
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
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





module.exports = router;
