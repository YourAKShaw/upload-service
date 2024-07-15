import multer from 'multer'; // File upload middleware
import * as UploadService from './upload.service.js';
import ApiResponse from '../common/ApiResponse.js';
import logger from '../common/logger.js';
import { FILE_SIZE_LIMIT } from '../common/constants.js';
import axios from 'axios';
import path from 'path'; // For path manipulation

const fileUpload = multer({
  dest: 'temp/', // Temporary storage location for uploaded files
  limits: { fileSize: FILE_SIZE_LIMIT },
});

async function upload(req, res) {
  try {
    if (req.body && req.body.fileUrl) {
      const fileUrl = req.body.fileUrl;

      // Download the file using axios
      const response = await axios.get(fileUrl, { responseType: 'stream' });
      if (response.status !== 200) {
        throw new Error(`Error fetching file from URL: ${fileUrl}`);
      }

      // Validate file size before processing (optional)
      const fileSize = parseInt(response.headers['content-length'], 10);
      if (fileSize > FILE_SIZE_LIMIT) {
        throw new Error(`File size exceeds the limit of ${FILE_SIZE_LIMIT}`);
      }

      const url = new URL(fileUrl);
      const fileName = path.basename(url.pathname);
      // Pass the downloaded stream and filename to UploadService
      const uploadedFileInfo = await UploadService.uploadFromStream(
        response.data,
        fileName,
      );

      return res.json(
        new ApiResponse({
          statusCode: 201,
          success: true,
          message: 'File uploaded successfully',
          data: uploadedFileInfo,
        }),
      );
    }

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
      const uploadedFileInfo = await UploadService.upload(
        uploadedFile.path,
        uploadedFile.originalname,
      );

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
