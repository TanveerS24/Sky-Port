import User from '../models/user.model.js';

const findByEmail = async (req,res) => {
    console.log("Find By Email Controller Invoked");
    try {
        const email = req.params.email;
        console.log("Finding user with Email: ", email);
        const user = await User.findOne({ email: email });
        if(!user){
            console.error("User not found with Email: ", email);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found: ", user);
        return res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        console.error("Error finding user: ", error);
        return res.status(422).json({ message: 'Error finding user', error: error.message });
    }
};

export default findByEmail;