import User from '../models/user.model.js';

const findByEmailHash = async (req, res) => {
    try {
        const { emailHash } = req.params;

        if (!emailHash) {
            return res.status(400).json({ 
                success: false, 
                message: 'EmailHash is required' 
            });
        }

        const user = await User.findOne({ emailHash }).populate('type');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                emailHash: user.emailHash,
                type: user.type,
                devices: user.devices,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error('Error finding user by emailHash:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export default findByEmailHash;
