import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    emailHash: { type: String, required: true, unique: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTypes', required: true },
    devices: [{ type: String, enum: ['mobile', 'tablet', 'desktop', 'web'] }],
    isActive: { type: Boolean, default: true }, 
    authUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    friends: { type: [{ type: String }], default: [] }, // Array of emailHash of friends
    friendRequests: {
        type: {
            incoming: [{ 
                emailHash: { type: String },
                email: { type: String },
                username: { type: String },
                sentAt: { type: Date, default: Date.now }
            }],
            outgoing: [{ 
                emailHash: { type: String },
                email: { type: String },
                username: { type: String },
                sentAt: { type: Date, default: Date.now }
            }]
        },
        default: { incoming: [], outgoing: [] }
    },
    notifications: {
        type: [{
            type: { type: String, enum: ['friend_request', 'friend_approved', 'friend_rejected'] },
            message: { type: String },
            read: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }],
        default: []
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema, "users");