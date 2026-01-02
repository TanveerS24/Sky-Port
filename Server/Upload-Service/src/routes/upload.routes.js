import {Router} from 'express';
import upload from '../middlewares/multer.middleware.js';
import uploadFile from '../controllers/upload.controller.js';
import healthCheck from '../controllers/health.controller.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/health', healthCheck);

export default router;