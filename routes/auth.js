const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");
const crypto = require('crypto'); 
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // ✅ Check all fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // ✅ Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // ✅ Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create user with mobile
    const user = new User({
      name,
      email,
      password: hashed,
      mobile
    });

    await user.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    // console.log(user, 'useruseruseruseruseruseruser')

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name , mobile:user.mobile, trustedMembers: user.trustedMembers }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email , mobile:user.mobile }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ TRANSPORTER ------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: generate OTP
function generateOtp() {
  if (typeof crypto.randomInt === 'function') {
    return crypto.randomInt(100000, 999999).toString();
  }
  const num = parseInt(crypto.randomBytes(4).toString('hex'), 16);
  return (100000 + (num % 900000)).toString();
}

// ------------------ FORGOT PASSWORD ------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

   await transporter.sendMail({
    from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your OTP for Password Reset - Smart Medicine Tracker",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification - Smart Medicine Tracker</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 20px;">
                    <!-- Main Container -->
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
                        
                        <!-- Security Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); padding: 40px 30px; text-align: center;">
                                <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                                    🔐
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">
                                    Password Reset OTP
                                </h1>
                                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                                    Secure access to your account
                                </p>
                            </td>
                        </tr>
                        
                        <!-- OTP Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <div style="color: #2d3436; font-size: 16px; line-height: 1.8;">
                                    <p style="margin: 0 0 25px 0; font-size: 18px; text-align: center;">
                                        Hello ${user.name}, we received a request to reset your password.
                                    </p>
                                    
                                    <!-- OTP Code Box -->
                                    <div style="text-align: center; margin: 35px 0;">
                                        <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); padding: 2px; border-radius: 16px; display: inline-block;">
                                            <div style="background-color: #ffffff; padding: 30px 40px; border-radius: 14px; box-shadow: inset 0 2px 8px rgba(116,185,255,0.2);">
                                                <p style="margin: 0 0 10px 0; color: #636e72; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                                                    Your OTP Code
                                                </p>
                                                <div style="font-size: 32px; font-weight: 700; color: #0984e3; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace;">
                                                    ${otp}
                                                </div>
                                                <p style="margin: 10px 0 0 0; color: #636e72; font-size: 12px;">
                                                    Enter this code in the app to reset your password
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Instructions -->
                                    <div style="background-color: #e8f4fd; border-left: 4px solid #74b9ff; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                            <span style="font-size: 18px; margin-right: 10px;">ℹ️</span>
                                            <h4 style="color: #0984e3; margin: 0; font-size: 16px; font-weight: 600;">
                                                How to use this code
                                            </h4>
                                        </div>
                                        <ol style="margin: 10px 0 0 0; color: #2d3436; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                                            <li style="margin-bottom: 5px;">Return to the Smart Medicine Tracker app</li>
                                            <li style="margin-bottom: 5px;">Enter the 6-digit code exactly as shown above</li>
                                            <li>Click "Verify" to complete the process</li>
                                        </ol>
                                    </div>

                                    <!-- Time Expiry Warning -->
                                    <div style="background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
                                        <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                            ⏰
                                        </div>
                                        <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                                            Time Sensitive
                                        </h4>
                                        <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
                                            This code expires in <strong>10 minutes</strong> for your security
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Security Tips -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h3 style="color: #2d3436; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">
                                    Security Tips
                                </h3>
                                <table role="presentation" style="width: 100%;">
                                    <tr>
                                        <td style="width: 50%; padding: 15px; vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                                <div style="font-size: 28px; margin-bottom: 10px;">🚫</div>
                                                <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                                                    Never Share
                                                </h4>
                                                <p style="color: #555; margin: 0; font-size: 12px; line-height: 1.4;">
                                                    Don't share this code with anyone, even if they claim to be from our team
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%; padding: 15px; vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                                <div style="font-size: 28px; margin-bottom: 10px;">🔒</div>
                                                <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                                                    Stay Secure
                                                </h4>
                                                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 12px; line-height: 1.4;">
                                                    If you didn't request this code, please ignore this email
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #2d3436 0%, #636e72 100%); padding: 30px; text-align: center;">
                                <div style="margin-bottom: 20px;">
                                    <div style="background-color: rgba(255,255,255,0.1); width: 50px; height: 50px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                        💊
                                    </div>
                                </div>
                                <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                                    Smart Medicine Tracker
                                </p>
                                <p style="color: rgba(255,255,255,0.8); margin: 0 0 20px 0; font-size: 14px;">
                                    Keeping your health data secure and accessible
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
                                    <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px; line-height: 1.5;">
                                        This OTP was sent to ensure account security.<br>
                                        If you need help, contact our support team.
                                    </p>
                                </div>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
});



    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
});

// ------------------ RESET PASSWORD ------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.resetOTP || user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otp !== String(user.resetOTP)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // ✅ Hash password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});


module.exports = router;
