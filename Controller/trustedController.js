// const User = require("../models/User");
// const TrustedMember = require("../models/TrustedMember");
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const { sendOTP } = require("../utils/email");

// // Add Trusted Member
// const addTrustedMember = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const user = req.user;
//     console.log(user, '111111111111111111111111111111111')
//     if (user.trustedMembers.length >= 3) {
//       return res.status(400).json({ msg: "Maximum 3 trusted members allowed" });
//     }

//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

//     const member = new TrustedMember({
//       user: user._id,
//       name,
//       email,
//       otp,
//       otpExpires,
//     });

//     await member.save();

//     const userDetail = await User.findById(req.user.id)
//     console.log(userDetail, 'userDetailuserDetailuserDetail')

//     userDetail.trustedMembers.push(member._id);
//     await userDetail.save();

//     await sendOTP(email, otp);

//     res.json({ msg: "Trusted member added successfully. OTP sent." });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Verify OTP
// const verifyTrustedOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const member = await TrustedMember.findOne({ email });
//     if (!member) return res.status(404).json({ msg: "Member not found" });
//     console.log(member, 'membermembermembermembermember')

//     if (member.otp !== otp || member.otpExpires < new Date()) {
//       return res.status(400).json({ msg: "Invalid or expired OTP" });
//     }

//     const token = jwt.sign(
//       { memberId: member._id, userId: member.user },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ msg: "OTP verified successfully", token });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Trusted Member Dashboard
// const trustedDashboard = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).populate("trustedMembers");
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({
//       profile: { name: user.name, email: user.email },
//       activeMedicines: [],       // TODO: integrate with Medicine.js
//       upcomingMedicines: [],
//       completedMedicines: [],
//       notifications: [],
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// module.exports = {
//   addTrustedMember,
//   verifyTrustedOtp,
//   trustedDashboard,
// };

const User = require("../models/User");
const TrustedMember = require("../models/TrustedMember");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../utils/email");
const { sendWelcomeEmail } = require("../utils/welcomeEmail");

// Add Trusted Member (no OTP)
// const addTrustedMember = async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ msg: "Main user not found" });

//         if (user.trustedMembers.length >= 3) {
//             return res.status(400).json({ msg: "Maximum 3 trusted members allowed" });
//         }

//         // Create trusted member
//         const member = new TrustedMember({
//             user: user._id, // link to main user
//             name,
//             email,
//         });
//         await member.save();

//         user.trustedMembers.push(member._id);
//         await user.save();

//         res.json({ msg: "Trusted member added successfully." });
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// };
const addTrustedMember = async (req, res) => {
  try {
    const { name, email,mobile } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Main user not found" });

    if (user.trustedMembers.length >= 3) {
      return res.status(400).json({ msg: "Maximum 3 trusted members allowed" });
    }

    // Create trusted member
    const member = new TrustedMember({
      user: user._id,
      name,
      email,
      mobile,
    });
    await member.save();

    user.trustedMembers.push(member._id);
    await user.save();

    // Send sweet welcome email 💌
    await sendWelcomeEmail(email, name, user.name);

    res.json({ msg: "Trusted member added successfully and welcome email sent." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Trusted Member requests OTP
const loginTrustedMember = async (req, res) => {
    try {
        const { email } = req.body;
        const member = await TrustedMember.findOne({ email });
        if (!member) return res.status(404).json({ msg: "Trusted member not found" });

        if (!member.user) {
            return res.status(400).json({ msg: "Trusted member exists but main user not linked. Re-add the trusted member." });
        }

        const mainUser = await User.findById(member.user);
        if (!mainUser) return res.status(404).json({ msg: "Main user not found" });

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        member.otp = otp;
        member.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await member.save();

        // Send OTP to main user's email
        await sendOTP(mainUser.email, otp);

        res.json({ msg: "OTP sent to the main user. Ask the user to share it with you." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Verify OTP
// const verifyTrustedOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         const member = await TrustedMember.findOne({ email });
//         if (!member) return res.status(404).json({ msg: "Trusted member not found" });

//         if (!member.otp || member.otp !== otp || member.otpExpires < new Date()) {
//             return res.status(400).json({ msg: "Invalid or expired OTP" });
//         }

//         const token = jwt.sign(
//             { memberId: member._id, userId: member.user },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

        

//         res.json({ msg: "OTP verified successfully", token });
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// };
// Verify OTP
const verifyTrustedOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const member = await TrustedMember.findOne({ email });
    if (!member) return res.status(404).json({ msg: "Trusted member not found" });

    if (!member.otp || member.otp !== otp || member.otpExpires < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Clear OTP after success
    member.otp = null;
    member.otpExpires = null;
    await member.save();

    // ✅ Token must carry trusted member id as `userId`
    const token = jwt.sign(
      { userId: member._id }, // trusted member id
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({ msg: "OTP verified successfully", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Trusted Member Dashboard
// const trustedDashboard = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).populate("trustedMembers");
//     if (!user) return res.status(404).json({ msg: "Main user not found" });

//     res.json({
//       profile: { name: user.name, email: user.email },
//       activeMedicines: [],
//       upcomingMedicines: [],
//       completedMedicines: [],
//       notifications: [],
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// const mongoose = require("mongoose");
// const Medicine = require("../models/Medicine");

// const trustedDashboard = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId).populate("trustedMembers");
//         if (!user) return res.status(404).json({ msg: "Main user not found" });

//         // Current time in "HH:mm"
//         const now = new Date();
//         const currentTime = now.toTimeString().slice(0, 5); // e.g. "09:40"

//         // Aggregation to classify medicines
//         const medicines = await Medicine.aggregate([
//             { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
//             { $unwind: "$doses" },

//             // Convert dose time24 ("09:40") to a full Date for today
//             {
//                 $addFields: {
//                     doseDate: {
//                         $dateFromString: {
//                             dateString: {
//                                 $concat: [
//                                     { $dateToString: { format: "%Y-%m-%d", date: now } },
//                                     "T",
//                                     "$doses.time24",
//                                     ":00Z"
//                                 ]
//                             }
//                         }
//                     },
//                     nowDate: {
//                         $dateFromString: {
//                             dateString: {
//                                 $concat: [
//                                     { $dateToString: { format: "%Y-%m-%d", date: now } },
//                                     "T",
//                                     currentTime,
//                                     ":00Z"
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },

//             // Calculate difference in minutes
//             {
//                 $addFields: {
//                     diffMinutes: {
//                         $divide: [
//                             { $subtract: ["$doseDate", "$nowDate"] },
//                             1000 * 60
//                         ]
//                     }
//                 }
//             },

//             // Classify into active / upcoming / completed
//             {
//                 $addFields: {
//                     status: {
//                         $switch: {
//                             branches: [
//                                 {
//                                     case: { $and: [{ $gte: ["$diffMinutes", -30] }, { $lte: ["$diffMinutes", 30] }] },
//                                     then: "active"
//                                 },
//                                 { case: { $gt: ["$diffMinutes", 30] }, then: "upcoming" },
//                                 { case: { $lt: ["$diffMinutes", -30] }, then: "completed" }
//                             ],
//                             default: "unknown"
//                         }
//                     }
//                 }
//             },

//             // Group back by status
//             {
//                 $group: {
//                     _id: "$status",
//                     medicines: {
//                         $push: {
//                             _id: "$_id",
//                             name: "$name",
//                             strength: "$strength",
//                             dosage: "$dosage",
//                             frequency: "$frequency",
//                             dose: "$doses"
//                         }
//                     }
//                 }
//             }
//         ]);

//         // Format result into fixed structure
//         const result = {
//             profile: { name: user.name, email: user.email },
//             activeMedicines: medicines.find(m => m._id === "active")?.medicines || [],
//             upcomingMedicines: medicines.find(m => m._id === "upcoming")?.medicines || [],
//             completedMedicines: medicines.find(m => m._id === "completed")?.medicines || [],
//             notifications: [], // you can fill later
//         };

//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// };

const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");

// const trustedDashboard = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).populate("trustedMembers");
//     if (!user) return res.status(404).json({ msg: "Main user not found" });

//     const now = new Date();

//     // Fetch all medicines for the user
//     const medicines = await Medicine.find({ userId: req.params.userId });

//     const activeMedicines = [];
//     const upcomingMedicines = [];
//     const completedMedicines = [];

//     medicines.forEach((med) => {
//       med.doses.forEach((dose) => {
//         const doseTimeParts = dose.time24.split(":");
//         let doseDate = new Date(now);
//         doseDate.setHours(parseInt(doseTimeParts[0], 10));
//         doseDate.setMinutes(parseInt(doseTimeParts[1], 10));
//         doseDate.setSeconds(0);
//         doseDate.setMilliseconds(0);

//         let include = false;

//         if (med.frequency === "once") {
//           const startDate = new Date(med.startDate);
//           include = now.toDateString() === startDate.toDateString();
//         } else if (med.frequency === "daily") {
//           const startDate = new Date(med.startDate);
//           const endDate = med.endDate ? new Date(med.endDate) : null;
//           include = now >= startDate && (!endDate || now <= endDate);
//         } else if (med.frequency === "weekly") {
//           const startDate = new Date(med.startDate);
//           if (startDate > now) {
//             include = true; // Future weekly medicine, mark as upcoming
//             doseDate = startDate; // For sorting into upcoming
//           } else {
//             const todayWeekday = now.toLocaleDateString("en-US", { weekday: "long" });
//             include = med.daysOfWeek.includes(todayWeekday);
//           }
//         }

//         if (!include) return; // Skip this dose

//         const diffMinutes = (doseDate - now) / (1000 * 60);

//         let status = "unknown";
//         if (diffMinutes >= -0 && diffMinutes <= 30) status = "active";
//         else if (diffMinutes > 30) status = "upcoming";
//         else if (diffMinutes < 0) status = "completed";

//         const medObj = {
//           _id: med._id,
//           name: med.name,
//           strength: med.strength,
//           dosage: med.dosage,
//           frequency: med.frequency,
//           dose,
//           color: med.color,
//           shape: med.shape,
//         };

//         if (status === "active") activeMedicines.push(medObj);
//         else if (status === "upcoming") upcomingMedicines.push(medObj);
//         else if (status === "completed") completedMedicines.push(medObj);
//       });
//     });

//     res.json({
//       profile: { name: user.name, email: user.email },
//       activeMedicines,
//       upcomingMedicines,
//       completedMedicines,
//       notifications: [], // fill later
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

const Notification = require('../models/Notification'); // add at top of file near other requires


const trustedDashboard = async (req, res) => {
  try {
    // Trusted member id from JWT
    const trustedId = req.user?.id;
    if (!trustedId) {
      return res.status(401).json({ msg: "Unauthorized: no trustedId" });
    }

    // Find trusted member and populate linked main user
    const member = await TrustedMember.findById(trustedId).populate("user");
    if (!member) {
      return res.status(404).json({ msg: "Trusted member not found" });
    }

    const mainUser = member.user;
    if (!mainUser) {
      return res
        .status(404)
        .json({ msg: "Main user not linked to this trusted member" });
    }

    const now = new Date();

    // Fetch all medicines for the patient
    const medicines = await Medicine.find({ userId: mainUser._id });

    const activeMedicines = [];
    const upcomingMedicines = [];
    const completedMedicines = [];

    medicines.forEach((med) => {
      med.doses.forEach((dose) => {
        const doseTimeParts = dose.time24.split(":");
        let doseDate = new Date(now);
        doseDate.setHours(parseInt(doseTimeParts[0], 10));
        doseDate.setMinutes(parseInt(doseTimeParts[1], 10));
        doseDate.setSeconds(0);
        doseDate.setMilliseconds(0);

        let include = false;

        if (med.frequency === "once") {
          const startDate = new Date(med.startDate);
          include = now.toDateString() === startDate.toDateString();
        } else if (med.frequency === "daily") {
          const startDate = new Date(med.startDate);
          const endDate = med.endDate ? new Date(med.endDate) : null;
          include = now >= startDate && (!endDate || now <= endDate);
        } else if (med.frequency === "weekly") {
          const startDate = new Date(med.startDate);
          if (startDate > now) {
            include = true;
            doseDate = startDate;
          } else {
            const todayWeekday = now.toLocaleDateString("en-US", {
              weekday: "long",
            });
            include = med.daysOfWeek.includes(todayWeekday);
          }
        }

        if (!include) return;

        const diffMinutes = (doseDate - now) / (1000 * 60);

        let status = "unknown";
        if (diffMinutes >= 0 && diffMinutes <= 30) status = "active";
        else if (diffMinutes > 30) status = "upcoming";
        else if (diffMinutes < 0) status = "completed";

        const medObj = {
          _id: med._id,
          name: med.name,
          strength: med.strength,
          dosage: med.dosage,
          frequency: med.frequency,
          dose,
          color: med.color,
          shape: med.shape,
        };

        if (status === "active") activeMedicines.push(medObj);
        else if (status === "upcoming") upcomingMedicines.push(medObj);
        else if (status === "completed") completedMedicines.push(medObj);
      });
    });

    // Fetch notifications for this trusted member
    const notificationsDocs = await Notification.find({ trustedId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const notifications = notificationsDocs.map((n) => ({
      _id: n._id,
      message: n.message,
      isRead: !!n.isRead,
      createdAt: n.createdAt,
    }));

    res.json({
      profile: { name: mainUser.name, email: mainUser.email },
      trustedMember: { name: member.name, email: member.email },
      activeMedicines,
      upcomingMedicines,
      completedMedicines,
      notifications,
    });
  } catch (err) {
    console.error("trustedDashboard error:", err);
    res.status(500).json({ msg: err.message });
  }
};









// Get all trusted members of a main user
const getTrustedMembers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("trustedMembers");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({ trustedMembers: user.trustedMembers });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Delete a trusted member
const deleteTrustedMember = async (req, res) => {
    try {
        const { memberId } = req.params;

        const member = await TrustedMember.findById(memberId);
        if (!member) return res.status(404).json({ msg: "Trusted member not found" });

        // Ensure the member belongs to the logged-in user
        if (member.user.toString() !== req.user.id)
            return res.status(403).json({ msg: "Not authorized to delete this member" });

        await TrustedMember.findByIdAndDelete(memberId);

        // Remove from main user's array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { trustedMembers: memberId },
        });

        res.json({ msg: "Trusted member deleted successfully." });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


module.exports = {
    addTrustedMember,
    loginTrustedMember,
    verifyTrustedOtp,
    trustedDashboard,
    getTrustedMembers,
    deleteTrustedMember
};
