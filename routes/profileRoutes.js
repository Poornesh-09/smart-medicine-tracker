const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");

// Multer setup for memory storage (stores file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload profile picture
router.post("/upload/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profilePic = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.json({ success: true, message: "Profile picture uploaded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile picture
router.get("/profile-pic/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePic?.data) {
      return res.status(404).json({ error: "No profile picture" });
    }
    res.contentType(user.profilePic.contentType);
    res.send(user.profilePic.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
