import authUserModel from '../models/authUser.model.js';
import { hashForSearch } from '../utils/crypto.util.js';

const isVerifiedController = async (req, res) => {
    console.log('isVerified controller invoked');
    const { email } = req.body;
    const emailHash = hashForSearch(email);

    const user = await authUserModel.findOne({ emailHash });
    if (!user) {
        console.log('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
    }
    console.log('User verification status retrieved for email:', email);
    return res.json({ isVerified: user.isVerified });
}

export default isVerifiedController;