import express from 'express';
import * as UploadController from './upload.controller.js';

const router = express.Router();

router.post('/', UploadController.upload);

export default router;
