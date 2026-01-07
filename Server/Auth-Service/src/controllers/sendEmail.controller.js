import crypto from "crypto";
import OTPVerification from "../models/otpVerification.model.js";
import AuthUser from "../models/authUser.model.js";
import sendOTPEmail from "../utils/OTPVerification.util.js";
import {hashPassword} from '../utils/hash.util.js';
import {hashForSearch} from "../utils/crypto.util.js"

const sendEmailController = async (req, res) => {
  console.log("Email verification controller invoked");
  let { email } = req.body;
  
  email = email.trim().toLowerCase();
  console.log("Normalized email:", email);
  
  const emailHash = hashForSearch(email);
  console.log("Email hash:", emailHash);

  const existingUser = await AuthUser.findOne({ emailHash });
  console.log("User found:", existingUser ? "YES" : "NO");
  
  if (!existingUser) {
    return res.status(404).json({ message: "User with this email does not exist" });
  }
  
  if (existingUser.isVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log("Generated OTP:", otp);

  try {
    await sendOTPEmail(email, otp);
    const hashedOTP = await hashPassword(otp);
    await OTPVerification.deleteOne({ emailHash });
    const otpEntry = new OTPVerification({
      emailHash,
      otp: hashedOTP
    });
    await otpEntry.save();
    console.log("OTP saved to database for email:", email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};
export default sendEmailController;