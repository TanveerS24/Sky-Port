import User from '../models/user.model.js';
import { decrypt, hashForSearch } from '../utils/crypto.util.js';

const findByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const emailHash = hashForSearch(email);

        const user = await User.findOne({ emailHash });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: {
                ...user._doc,
                email: decrypt(user.email),
                username: decrypt(user.username)
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export default findByEmail;
