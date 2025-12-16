import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('AuthUser', authUserSchema);