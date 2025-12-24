import User from "../models/user.model.js";
import axios from "axios";

const deleteUser = async (req, res) => {
    console.log('Delete User controller invoked');
    try{
        const id = req.params.id;

        const user = await User.findById(id);
        if (!user) {
            console.log("User doesn't Exist");
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("User found: ", user);
        const authUserId = user.authUserId.toString();
        console.log("Auth User ID: ", authUserId);
        await axios.delete(`${process.env.API_GATEWAY_URL}/api/auth/delete-user/${authUserId}`);

        console.log("Deleting user: ", user);
        
        const deletedUser =  await User.findByIdAndDelete(id);
        console.log("Deleted user: ", deletedUser);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export default deleteUser;