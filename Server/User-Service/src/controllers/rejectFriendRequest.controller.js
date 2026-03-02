import User from '../models/user.model.js';

const rejectFriendRequest = async (req, res) => {
    try {
        const { userEmail, requesterEmailHash } = req.body;

        if (!userEmail || !requesterEmailHash) {
            return res.status(400).json({ 
                success: false, 
                message: 'User email and requester emailHash are required' 
            });
        }

        // Find both users
        const user = await User.findOne({ email: userEmail });
        const requester = await User.findOne({ emailHash: requesterEmailHash });

        if (!user || !requester) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Find the incoming request
        const requestIndex = user.friendRequests.incoming.findIndex(
            req => req.emailHash === requesterEmailHash
        );

        if (requestIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Friend request not found' 
            });
        }

        // Remove from incoming requests
        user.friendRequests.incoming.splice(requestIndex, 1);

        // Remove from requester's outgoing requests
        const outgoingIndex = requester.friendRequests.outgoing.findIndex(
            req => req.emailHash === user.emailHash
        );
        if (outgoingIndex !== -1) {
            requester.friendRequests.outgoing.splice(outgoingIndex, 1);
        }

        // Add notification to requester
        requester.notifications.push({
            type: 'friend_rejected',
            message: `${user.username} declined your friend request`,
            read: false,
            createdAt: new Date()
        });

        await user.save();
        await requester.save();

        res.status(200).json({ 
            success: true, 
            message: 'Friend request rejected' 
        });

    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export default rejectFriendRequest;
