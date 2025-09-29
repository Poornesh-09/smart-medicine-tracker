// const mongoose = require("mongoose");

// const trustedMemberSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     name: String,
//     email: String,
//     otp: String,
//     otpExpires: Date,
// });

// module.exports = mongoose.model("TrustedMember", trustedMemberSchema);

const mongoose = require("mongoose");

const trustedMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // main user reference
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("TrustedMember", trustedMemberSchema);

