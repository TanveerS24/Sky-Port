import User from "../models/user.model.js";
import { encrypt, decrypt } from "../utils/crypto.util.js";

const editUser = async (req, res) => {
    console.log("Edit User controller invoked");
    try {
        const id = req.params.id;
        const updates = req.body;

        console.log("Updates received: ", updates);

        const allowedEdits = ['username'];

        Object.keys(updates).forEach((key) => {
            if (!allowedEdits.includes(key)) {
                delete updates[key];
            }
        });

        // Encrypt username before saving
        if (updates.username) {
            updates.username = encrypt(updates.username);
        }

        const updatedUser = await User.findByIdAndUpdate(id, {$set: updates}, { new: true, runValidators: true });

        if(!updatedUser){
            console.log("User doesn't Exist");
            return res.status(404).json({message:"User doesn't Exist"});
        }

        // Decrypt sensitive fields before returning
        const responseUser = {
            ...updatedUser._doc,
            username: decrypt(updatedUser.username),
            email: decrypt(updatedUser.email)
        };

        return res.status(200).json({ message: 'User updated successfully', user: responseUser });

    } catch (error) {
        console.error("Error updating user: ", error);
        return res.status(422).json({ message: 'Error updating user', error: error.message });
    }
};

export default editUser;