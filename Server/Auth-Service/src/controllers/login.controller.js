import authUserModel from '../models/authUser.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';
import { comparePassword } from '../utils/hash.util.js';

const loginController = async (req, res) => {
    const { email, password } = req.body;
    const user = await authUserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken.push(refreshToken);
    await user.save();

    res.json({ accessToken, refreshToken });
};

export default loginController;