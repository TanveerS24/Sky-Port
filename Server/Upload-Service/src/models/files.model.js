import mongoose from 'mongoose';

const userFilesSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true
    },
    files: [{
        fileId: {
            type: String,
            required: true,
            default: () => crypto.randomUUID()
        },
        fileName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        folder: {
            type: String,
            required: true
        },
        cloudinary: {
            publicId: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        sharedWith: [{
            type: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const UserFiles = mongoose.model('UserFiles', userFilesSchema);

export default UserFiles;