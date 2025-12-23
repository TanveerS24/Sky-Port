import authUser from '../models/authUser.model.js';
import { hashPassword } from '../utils/hash.util.js';
import axios from 'axios';

const registerController = async (req, res) => {
    console.log('Register controller invoked');
    const { email, password, username, devices } = req.body;

    try {
        const existingUser = await authUser.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPwd = await hashPassword(password);
        const AuthUser = await authUser.create({ email, password: hashedPwd });

        try {
            // Use API Gateway endpoint instead of direct User Service URL
            const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:3005';
            const response = await axios.post(`${apiGatewayUrl}/api/user/createuser`, {
                email,
                authUserId: AuthUser._id,
                username,
                devices
            });
            if (response.status !== 201) {
                throw new Error('Failed to create user in User Service');
            } else{
                console.log('User created in User Service successfully');
            }
            
        } catch (error) {
            await authUser.findByIdAndDelete(AuthUser._id);
            console.error('Error creating user in User Service:', error.message);
            return res.status(500).json({ message: 'Failed to create user in User Service' });
        }

        console.log('User registered successfully with email:', email);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export default registerController;