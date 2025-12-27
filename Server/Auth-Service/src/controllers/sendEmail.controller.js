import crypto from "crypto";

import OTPVerification from "../models/otpVerification.model.js";
import AuthUser from "../models/authUser.model.js";
import sendOTPEmail from "../utils/OTPVerification.util.js";
import {hashPassword} from '../utils/hash.util.js';

const sendEmailController = async (req, res) => {
  console.log("Email verification controller invoked");
  const { email } = req.body;

  const existingUser = await AuthUser.findOne({ email });
  if (existingUser && existingUser.isVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User with this email does not exist" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    await sendOTPEmail(email, otp);
    const hashedOTP = await hashPassword(otp);
    const otpEntry = new OTPVerification({
      email,
      otp: hashedOTP
    });
    await otpEntry.save();

    console.log("OTP saved to database for email:", email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};
export default sendEmailController;