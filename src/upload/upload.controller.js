import multer from 'multer'; // File upload middleware
import * as UploadService from './upload.service.js';
import ApiResponse from '../common/ApiResponse.js';
import logger from '../common/logger.js';
import { FILE_SIZE_LIMIT } from '../common/constants.js';

const fileUpload = multer({
  dest: 'temp/', // Temporary storage location for uploaded files
  limits: { fileSize: FILE_SIZE_LIMIT },
});

async function upload(req, res) {
  try {
    // Use fileUpload.single('fieldName') as middleware before the function body
    await fileUpload.single('fieldName')(req, res, async (err) => {
      if (err) {
        logger.error(`[UploadController] Error uploading file: ${err}`);
        return res.status(400).json(
          new ApiResponse({
            statusCode: 400,
            success: false,
            message: err.message || 'Error uploading file',
          }),
        );
      }

      // Access the uploaded file information from req.file
      const uploadedFile = req.file;
      if (!uploadedFile) {
        throw new Error('No file uploaded');
      }

      // Call uploadService.upload to handle file processing
      const uploadedFileInfo = await UploadService.upload(uploadedFile.path, uploadedFile.originalname);

      res.json(
        new ApiResponse({
          statusCode: 201,
          success: true,
          message: 'File uploaded successfully',
          data: uploadedFileInfo,
        }),
      );
    });
  } catch (error) {
    logger.error('[UploadController] Error uploading file:', error);
    res.status(400).json(
      new ApiResponse({
        statusCode: 400,
        success: false,
        message: error.message || 'Error uploading file',
      }),
    );
  } finally {
    // Optional cleanup (e.g., remove temporary files)
  }
}

export { upload };
