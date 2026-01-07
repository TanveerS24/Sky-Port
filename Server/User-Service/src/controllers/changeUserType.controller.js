import User from '../models/user.model.js';
import UserTypes from '../models/userTypes.model.js';
import {hashForSearch} from '../utils/crypto.util.js';

const changeUserType = async (req, res) => {
    console.log("Change User Type endpoint Invoked");
    const { email, newType } = req.body;

    if (!email || !newType) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const hashedEmail = hashForSearch(email);
    try {
        const typeDoc = await UserTypes.findOne({ type: newType });
        if (!typeDoc) {
            return res.status(404).json({ message: "User type not found" });
        }
        const user = await User.findOne({ emailHash: hashedEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.type = typeDoc._id;
        await user.save();
        console.log(`User type for user with email ${email} changed to ${newType}`);
        return res.status(200).json({ message: "User type updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export default changeUserType;