import fs from 'fs/promises'; // For file system operations (promises)
import path from 'path'; // For path manipulation
import logger from '../common/logger.js';
import { v4 as uuidv4 } from 'uuid'; // For generating unique identifiers
import { FILE_SIZE_LIMIT } from '../common/constants.js';

async function upload(filePath, fileName) {
  try {
    const stats = await fs.stat(filePath); // Get file stats
    if (stats.size > FILE_SIZE_LIMIT) {
      throw new Error('File size exceeds the limit of 1MB');
    }

    const __dirname = path.dirname(new URL(import.meta.url).pathname); // Get directory path using import.meta.url
    const currentDate = new Date().toISOString().replace(/[:|.]/g, ''); // Format date (remove colons, pipes, and periods)
    const uniqueSuffix = `_${uuidv4()}`; // Add a unique identifier

    const newFileName = `${fileName.split('.')[0]}-${currentDate}${uniqueSuffix}.${fileName.split('.')[1]}`; // Construct new filename with datetime and unique suffix
    const destinationPath = path.join(__dirname, '../../uploads', newFileName); // Construct destination path

    await fs.rename(filePath, destinationPath); // Move the file

    logger.success(`File uploaded successfully to: ${destinationPath}`);
    return {
      fileName,
      size: stats.size,
    }; // Return file information
  } catch (error) {
    logger.error('Error uploading file:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

export { upload };
