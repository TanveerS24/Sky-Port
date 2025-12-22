import { Router } from 'express';
import healthCheck from '../middlewares/healthCheck.js';
import loginController from '../controllers/login.controller.js';
import logoutController from '../controllers/logout.controller.js';
import refreshController from '../controllers/refreshToken.controller.js';
import registerController from '../controllers/register.controller.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh-token', refreshController);
router.post('/register', registerController);

export default router;
