const express = require("express");
const router = express.Router();

const { addTrustedMember, verifyTrustedOtp,loginTrustedMember, trustedDashboard, getTrustedMembers,deleteTrustedMember} = require("../Controller/trustedController");
const authUser = require("../middleware/auth");  // ✅ no destructuring

// User adds trusted member
router.post("/add", authUser, addTrustedMember);

// Trusted member requests OTP
router.post("/login", loginTrustedMember);

// Trusted member verifies OTP
router.post("/verify", verifyTrustedOtp);

// Trusted member dashboard
// router.get("/dashboard/:userId", trustedDashboard);
// Trusted member dashboard (protected)
router.get("/dashboard/:userId", authUser, trustedDashboard);


// Get all trusted members for main user
router.get("/list", authUser, getTrustedMembers);

// Delete a trusted member
router.delete("/delete/:memberId", authUser, deleteTrustedMember);

module.exports = router;
