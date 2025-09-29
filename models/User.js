const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required:true },
  email: { type: String, required:true, unique:true },
  password: { type: String, required:true },
  mobile: { type: String, required:false, unique:true },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  resetOTP: String,
  resetOTPExpiry: Date,
  trustedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "TrustedMember" }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
