import authUserModel from '../models/authUser.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';
import { comparePassword } from '../utils/hash.util.js';

const loginController = async (req, res) => {
    console.log('Login controller invoked');
    const { email, password } = req.body;
    const user = await authUserModel.findOne({ email });
    if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: 'User not found' });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
        console.log('Invalid password attempt for email:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken.push(refreshToken);
    await user.save();

    console.log('User logged in successfully:', email);
    return res.json({ accessToken, refreshToken });
};

export default loginController;