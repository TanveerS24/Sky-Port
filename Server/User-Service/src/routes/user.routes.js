import { Router } from 'express';
import createUser from '../controllers/createUser.controller.js';
import deleteUser from '../controllers/deleteUser.controller.js';
import editUser from '../controllers/editUser.controller.js';
import findById from '../controllers/findById.controller.js';
import findByEmail from '../controllers/findByEmail.controller.js';
import healthCheck from '../middlewares/healthCheck.controller.js';

const router = Router();

router.post('/createuser', createUser);
router.delete('/deleteuser/:id', deleteUser);
router.patch('/edituser/:id', editUser);
router.get('/findbyuser/:id', findById);
router.get('/findbyemail/:email', findByEmail);
router.get('/health', healthCheck);

export default router;