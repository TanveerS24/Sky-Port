import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
    email: { type: String, required: true }, // encrypted email
    emailHash: { type: String, required: true, unique: true }, // 🔑 for lookup
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: [String],
}, { timestamps: true });

export default mongoose.model('AuthUser', authUserSchema, "authUsers");
