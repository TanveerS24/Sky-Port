import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 120 } // OTP expires in 2 minutes
}, { timestamps: true });

export default mongoose.model('OTPVerification', otpVerificationSchema, "otpVerifications");