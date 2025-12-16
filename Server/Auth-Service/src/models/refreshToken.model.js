import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    deviceID: { type: String, required: true },
    revoked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('RefreshToken', refreshTokenSchema);