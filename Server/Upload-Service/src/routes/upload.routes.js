import { Router } from 'express';
import upload from '../middlewares/multer.middleware.js';
import uploadFile from '../controllers/upload.controller.js';
import healthCheck from '../middlewares/healthCheck.middleware.js';
import giveAccess from '../controllers/giveAccess.controller.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/give-access', giveAccess);
router.get('/health', healthCheck);

export default router;