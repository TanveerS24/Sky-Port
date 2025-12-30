import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },

    // 🔑 searchable field
    emailHash: { type: String, required: true, unique: true },

    devices: [{ type: String, enum: ['mobile', 'tablet', 'desktop', 'web'] }],
    isActive: { type: Boolean, default: true },
    authUserId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema, "users");