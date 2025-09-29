// const express = require("express");
// const Notification = require("../models/Notification");
// const router = express.Router();

// // Get notifications for a trusted member
// router.get("/:trustedId", async (req, res) => {
//   try {
//     const notifications = await Notification.find({ trustedId: req.params.trustedId })
//       .sort({ createdAt: -1 });
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Mark notification as read
// router.put("/:id/read", async (req, res) => {
//   try {
//     const updated = await Notification.findByIdAndUpdate(
//       req.params.id,
//       { isRead: true },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// --- FILE: server/routes/notifications.js ---
const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const router = express.Router();

// GET /api/notifications/:trustedId
// Returns latest notifications for a trusted member (most recent first).
router.get("/:trustedId", async (req, res) => {
  const { trustedId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(trustedId)) {
    return res.status(400).json({ error: "Invalid trustedId" });
  }

  try {
    const notifications = await Notification.find({ trustedId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json(notifications);
  } catch (err) {
    console.error("GET /notifications/:trustedId error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/notifications/:id/read
// Mark a single notification as read.
router.put("/:id/read", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid notification id" });
  }

  try {
    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /notifications/:id/read error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// DELETE /api/notifications/:id
// Delete a notification
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid notification id" });
  }

  try {
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ msg: "Notification deleted successfully" });
  } catch (err) {
    console.error("DELETE /notifications/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
