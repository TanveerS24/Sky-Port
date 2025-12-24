import {comparePassword, hashPassword} from '../utils/hash.util.js';
import axios from 'axios';
import authUser from '../models/authUser.model.js';

const updatePassword = async (req, res) => {
    console.log('Update password controlled invoked');
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;
        const token = req.headers['authorization'];

        if (!token) {
            console.log('No access token provided in request headers');
            return res.status(401).json({ message: 'Couldnt find access token' });
        }

        const user = await axios.get(`${process.env.API_GATEWAY_URL}/api/user/findbyuser/${userId}`,{
            headers: {
                'Authorization': token
            }
        });
        if(user.status !== 200){
            console.error('User not found in User Service for userId:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const authUserId = user.data?.user?.authUserId?.$oid || user.data?.user?.authUserId; // check and remove one 
        if (!authUserId) {
            console.error('AuthUserId not found in user data for userId:', userId);
            return res.status(404).json({ message: 'Auth user ID not found' });
        }
        console.log('Auth User found in User Service:', authUserId);
        const authUserRecord = await authUser.findById(authUserId);
        if (!authUserRecord) {
            console.error('Auth user record not found for userId:', userId);
            return res.status(404).json({ message: 'Auth user record not found' });
        }

        const isMatch = await comparePassword(currentPassword, authUserRecord.password);
        if (!isMatch) {
            console.log("Current password does not match for userId:", userId);
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        authUserRecord.password = hashedNewPassword;
        await authUserRecord.save();
        console.log("Password updated successfully for userId:", userId);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password for userId:', req.params.userId, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default updatePassword;