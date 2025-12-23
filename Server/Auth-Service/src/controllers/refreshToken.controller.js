import jwt from 'jsonwebtoken';
import authUser from '../models/authUser.model.js';
import { generateAccessToken } from '../utils/token.util.js';

const refreshTokenController = async (req, res) => {
    console.log('Refresh Token controller invoked');
    const { refreshToken } = req.body;

    if (!refreshToken) {
        console.log('No refresh token provided in request body');
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    const user = await authUser.findOne({ refreshToken });
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const payload = { id: decoded.id, email: decoded.email };
        const newAccessToken = generateAccessToken(payload);

        console.log('New access token generated successfully');
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

export default refreshTokenController;