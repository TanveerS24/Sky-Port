import User from '../models/user.model.js';

const markNotificationsRead = async (req, res) => {
    try {
        const { email } = req.body;

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

        // Mark all notifications as read
        user.notifications.forEach(notification => {
            notification.read = true;
        });

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Notifications marked as read' 
        });

    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export default markNotificationsRead;
