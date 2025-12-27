import OTPVerification from "../models/otpVerification.model.js";
import AuthUser from "../models/authUser.model.js";
import { comparePassword } from "../utils/hash.util.js";

const verifyOtpController = async (req, res) => {
  console.log("OTP verification controller invoked");
  const { email, otp } = req.body;
    const otpEntry = await OTPVerification.findOne({ email });
    if (!otpEntry) {
      return res.status(400).json({ message: "No OTP request found for this email" });
    }
    const isOtpValid = await comparePassword(otp, otpEntry.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const user = await AuthUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isVerified = true;
    await user.save();
    await OTPVerification.deleteOne({ email });
    console.log("Email verified for user:", email);
    res.status(200).json({ message: "Email verified successfully" });
};

export default verifyOtpController;