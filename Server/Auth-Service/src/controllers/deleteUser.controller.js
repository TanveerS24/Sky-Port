import authUser from '../models/authUser.model.js';
const deleteUser = async (req, res) => {
    console.log('Delete User controller invoked');
    try{
        const id = req.params.id;

        const user = await authUser.findById(id);

        if(!user){
            console.log('User not found with id:', id);
            return res.status(404).json({ message: 'User not found' });
        }
        await authUser.findByIdAndDelete(id);
        console.log('User deleted successfully with id:', id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch(error){
        console.error('Error deleting user with id:', req.params.id, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default deleteUser;