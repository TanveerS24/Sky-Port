import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    refreshToken: [String],
}, { timestamps: true });

export default mongoose.model('AuthUser', authUserSchema, "authUsers");