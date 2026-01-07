import OTPVerification from "../models/otpVerification.model.js";
import AuthUser from "../models/authUser.model.js";
import { comparePassword } from "../utils/hash.util.js";
import {hashForSearch} from "../utils/crypto.util.js"

const verifyOtpController = async (req, res) => {
  console.log("OTP verification controller invoked");
  let { email, otp } = req.body;
  email = email.trim().toLowerCase();
  const emailHash = hashForSearch(email);
  const otpEntry = await OTPVerification.findOne({ emailHash });
  if (!otpEntry) {
    console.log("No OTP request found for this email:", email);
    return res.status(400).json({ message: "No OTP request found for this email" });
  }
  const isOtpValid = await comparePassword(otp, otpEntry.otp); 
  if (!isOtpValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const user = await AuthUser.findOne({ emailHash });
  if (!user) {
    console.log("User not found for email:", email);
    return res.status(404).json({ message: "User not found" });
  }
  
  user.isVerified = true;
  await user.save();
  await OTPVerification.deleteOne({ _id: otpEntry._id });
  res.status(200).json({ message: "Email verified successfully" });
};

export default verifyOtpController;