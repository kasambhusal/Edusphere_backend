const Otp = require("../models/auth.modal");
const userModal = require("../models/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await userModal.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save OTP to DB
  await Otp.create({ email, otp });

  // Send OTP via email (configure nodemailer with your SMTP details)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to send email", error: err });
    }
    return res.status(200).json({ message: "OTP sent successfully" });
  });
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // OTP is valid
  res.status(200).json({ message: "OTP verified successfully" });
};

module.exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  const user = await userModal.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update password (assuming a `hashPassword` method exists)
  user.password = await userModal.hashPassword(newPassword);
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};
