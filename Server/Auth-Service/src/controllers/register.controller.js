import authUser from '../models/authUser.model.js';
import { hashPassword } from '../utils/hash.util.js';
import { encrypt, hashForSearch } from '../utils/crypto.util.js';
import axios from 'axios';

const registerController = async (req, res) => {
    console.log('Register controller invoked');
    const { email, password, username, devices } = req.body;

    try {
        const emailHash = hashForSearch(email);

        const existingUser = await authUser.findOne({ emailHash });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPwd = await hashPassword(password);

        const AuthUser = await authUser.create({
            email: encrypt(email),
            emailHash,
            password: hashedPwd
        });

        try {
            const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:3005';

            await axios.post(`${apiGatewayUrl}/api/user/createuser`, {
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
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default registerController;
