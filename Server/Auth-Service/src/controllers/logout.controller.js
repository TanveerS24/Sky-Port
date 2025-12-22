import authUserModel from '../models/authUser.model.js';

const logoutController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        await authUserModel.updateOne(
            {refreshToken: refreshToken},
            { $pull: { refreshToken: refreshToken } }
        );

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

export default logoutController;