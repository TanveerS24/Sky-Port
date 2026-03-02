import User from '../models/user.model.js';

const sendFriendRequest = async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;

        if (!senderEmail || !receiverEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'Sender and receiver emails are required' 
            });
        }

        if (senderEmail === receiverEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot send friend request to yourself' 
            });
        }

        // Find both users
        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if already friends
        if (sender.friends.includes(receiver.emailHash)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Already friends with this user' 
            });
        }

        // Check if request already sent
        const alreadySent = sender.friendRequests.outgoing.some(
            req => req.emailHash === receiver.emailHash
        );
        if (alreadySent) {
            return res.status(400).json({ 
                success: false, 
                message: 'Friend request already sent' 
            });
        }

        // Check if there's already an incoming request from the receiver
        const incomingRequest = sender.friendRequests.incoming.some(
            req => req.emailHash === receiver.emailHash
        );
        if (incomingRequest) {
            return res.status(400).json({ 
                success: false, 
                message: 'This user has already sent you a friend request. Please check your incoming requests.' 
            });
        }

        // Add to sender's outgoing requests
        sender.friendRequests.outgoing.push({
            emailHash: receiver.emailHash,
            email: receiver.email,
            username: receiver.username,
            sentAt: new Date()
        });

        // Add to receiver's incoming requests
        receiver.friendRequests.incoming.push({
            emailHash: sender.emailHash,
            email: sender.email,
            username: sender.username,
            sentAt: new Date()
        });

        // Add notification to receiver
        receiver.notifications.push({
            type: 'friend_request',
            message: `${sender.username} sent you a friend request`,
            read: false,
            createdAt: new Date()
        });

        await sender.save();
        await receiver.save();

        res.status(200).json({ 
            success: true, 
            message: 'Friend request sent successfully' 
        });

    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export default sendFriendRequest;
