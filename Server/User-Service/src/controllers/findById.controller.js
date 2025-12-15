import User from "../models/user.model.js";

const findById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Finding user with ID: ", id);
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default findById;