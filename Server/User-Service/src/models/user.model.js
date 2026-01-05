import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    emailHash: { type: String, required: true, unique: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTypes', required: true },
    devices: [{ type: String, enum: ['mobile', 'tablet', 'desktop', 'web'] }],
    isActive: { type: Boolean, default: true },
    authUserId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema, "users");