import authUser from '../models/authUser.model.js';
import { hashPassword } from '../utils/hash.util.js';
import axios from 'axios';

const registerController = async (req, res) => {
    const { email, password, username, devices } = req.body;

    try {
        const existingUser = await authUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPwd = await hashPassword(password);
        const AuthUser = await authUser.create({ email, password: hashedPwd });

        try {
            await axios.post('http://localhost:3000/user/createuser', {
                email,
                authUserId: AuthUser._id,
                username,
                devices
            });
        } catch (error) {
            await authUser.findByIdAndDelete(AuthUser._id);
            return res.status(500).json({ message: 'Failed to create user in User Service' });
        }

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export default registerController;