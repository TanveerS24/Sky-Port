import User from "../models/user.model.js";
import { decrypt } from "../utils/crypto.util.js";

const findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Not found" });

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

export default findById;
