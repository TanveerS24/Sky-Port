import User from '../models/user.model.js';

const getNotifications = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            notifications: user.notifications,
            unreadCount: user.notifications.filter(n => !n.read).length
        });

    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export default getNotifications;
