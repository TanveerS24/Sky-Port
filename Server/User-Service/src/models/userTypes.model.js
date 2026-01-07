import mongoose from 'mongoose';

const UserTypesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
});

export default mongoose.model('UserTypes', UserTypesSchema, "user_types");