import authUserModel from '../models/authUser.model.js';
import jwt from 'jsonwebtoken';

const logoutController = async (req, res) => {
    console.log('Logout controller invoked');
    try {
        // Get token from Authorization header
        const token = req.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
            console.log('No access token provided in request headers');
            return res.status(401).json({ message: 'Access token is required' });
        }

        // Verify and decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;

        // Clear all refresh tokens for this user
        const result = await authUserModel.updateOne(
            { _id: userId },
            { $set: { refreshToken: [] } }
        );

        if (result.matchedCount === 0) {
            console.log('No user found with this ID');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User logged out successfully, all refresh tokens cleared');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

export default logoutController;