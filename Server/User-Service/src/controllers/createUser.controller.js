import User from '../models/user.model.js';
import { encrypt, hashForSearch } from '../utils/crypto.util.js';

const createUser = async (req, res) => {
    console.log("Create User endpoint Invoked");
    try {
        const { username, email, devices, authUserId } = req.body;

        if (!username || !email || !authUserId) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const emailHash = hashForSearch(email);

        const exists = await User.findOne({ emailHash });
        if (exists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = new User({
            username: encrypt(username),
            email: encrypt(email),
            emailHash,
            devices,
            authUserId
        });

        await user.save();

        console.log("User created with ID:", user._id);
        return res.status(201).json({
            message: "User created successfully",
            userId: user._id
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export default createUser;