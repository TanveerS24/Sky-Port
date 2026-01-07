import { Router } from 'express';
import healthCheck from '../middlewares/healthCheck.middleware.js';
import loginController from '../controllers/login.controller.js';
import logoutController from '../controllers/logout.controller.js';
import refreshController from '../controllers/refreshToken.controller.js';
import registerController from '../controllers/register.controller.js';
import updatePassword from '../controllers/updatePassword.controller.js';
import deleteUser from '../controllers/deleteUser.controller.js';
import sendEmailController from '../controllers/sendEmail.controller.js';
import verifyOTPController from '../controllers/verifyOTP.controller.js';
import isVerifiedController from '../controllers/isVerified.controlled.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh-token', refreshController);
router.post('/register', registerController);
router.patch('/update-password/:userId', updatePassword);
router.delete('/delete-user/:id', deleteUser);
router.post('/send-otp', sendEmailController);
router.post('/verify-otp', verifyOTPController);
router.post('/is-verified', isVerifiedController);

export default router;
