import User from '../models/user.model.js';

const findByEmail = async (req,res) => {
    try {
        const email = req.params.email;
        console.log("Finding user with Email: ", email);
        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        return res.status(400).json({ message: 'Error finding user', error: error.message });
    }
};

export default findByEmail;