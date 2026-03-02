import { Router } from 'express';
import createUser from '../controllers/createUser.controller.js';
import deleteUser from '../controllers/deleteUser.controller.js';
import editUser from '../controllers/editUser.controller.js';
import findById from '../controllers/findById.controller.js';
import findByEmail from '../controllers/findByEmail.controller.js';
import findByEmailHash from '../controllers/findByEmailHash.controller.js';
import healthCheck from '../middlewares/healthCheck.middleware.js';
import createUserType from '../controllers/userType.controller.js';
import changeUserType from '../controllers/changeUserType.controller.js';
import sendFriendRequest from '../controllers/sendFriendRequest.controller.js';
import approveFriendRequest from '../controllers/approveFriendRequest.controller.js';
import rejectFriendRequest from '../controllers/rejectFriendRequest.controller.js';
import getNotifications from '../controllers/getNotifications.controller.js';
import markNotificationsRead from '../controllers/markNotificationsRead.controller.js';

const router = Router();

router.post('/createuser', createUser);
router.delete('/deleteuser/:id', deleteUser);
router.patch('/edituser/:id', editUser);
router.get('/findbyuser/:id', findById);
router.get('/findbyemail/:email', findByEmail);
router.get('/findbyemailhash/:emailHash', findByEmailHash);
router.get('/health', healthCheck);
router.post('/createusertype', createUserType);
router.patch('/changeusertype', changeUserType);
router.post('/sendfriendrequest', sendFriendRequest);
router.post('/approvefriendrequest', approveFriendRequest);
router.post('/rejectfriendrequest', rejectFriendRequest);
router.get('/notifications/:email', getNotifications);
router.post('/marknotificationsread', markNotificationsRead);

export default router;