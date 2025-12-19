import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    devices: [{ type: String, enum: ['mobile', 'tablet', 'desktop', 'web'] }],
    isActive: { type: Boolean, default: true } //testing 
}, { timestamps: true }); 

export default mongoose.model('User', userSchema);