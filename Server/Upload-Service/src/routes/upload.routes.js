import {Router} from 'express';
import upload from '../middlewares/multer.middleware.js';
import uploadFile from '../controllers/upload.controller.js';
import retrieveFiles from '../controllers/retrieveFiles.controller.js';
import deleteFile from '../controllers/deleteFile.controller.js';
import uploadBulk from '../controllers/uploadBulk.controller.js';
import healthCheck from '../middlewares/healthCheck.middleware.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/upload-bulk', upload.array('files', 100), uploadBulk);
router.post('/delete', deleteFile);
router.get('/health', healthCheck);
router.get('/files', retrieveFiles);

export default router;