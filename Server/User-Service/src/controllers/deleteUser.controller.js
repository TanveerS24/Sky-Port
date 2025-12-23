import User from "../models/user.model.js";

const deleteUser = async (req, res) => {
    console.log('Delete User controller invoked');
    try{
        const id = req.params.id;

        try {
            const user = await User.findById(id);
            if (!user) {
                console.log("User doesn't Exist");
                return res.status(404).json({ message: 'User not found' });
            }
            else{
                console.log("Deleting user: ", user);
            }
        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
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