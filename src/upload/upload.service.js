import fs from 'fs/promises'; // For file system operations (promises)
// root fs
import rfs from 'fs';
import path from 'path'; // For path manipulation
import logger from '../common/logger.js';
import { v4 as uuidv4 } from 'uuid'; // For generating unique identifiers
import { FILE_SIZE_LIMIT } from '../common/constants.js';

function getDestinationPath(fileName) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname); // Get directory path using import.meta.url
  const currentDate = new Date().toISOString().replace(/[:|.]/g, ''); // Format date (remove colons, pipes, and periods)
  const uniqueSuffix = `_${uuidv4()}`; // Add a unique identifier

  const newFileName = `${fileName.split('.')[0]}-${currentDate}${uniqueSuffix}.${fileName.split('.')[1]}`; // Construct new filename with datetime and unique suffix
  const destinationPath = path.join(__dirname, '../../uploads', newFileName); // Construct destination path
  return destinationPath;
}

async function upload(filePath, fileName) {
  try {
    const stats = await fs.stat(filePath); // Get file stats
    if (stats.size > FILE_SIZE_LIMIT) {
      throw new Error('File size exceeds the limit of 1MB');
    }

    const destinationPath = getDestinationPath(fileName);

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

async function uploadFromStream(fileStream, fileName) {
  try {
    const destinationPath = getDestinationPath(fileName);

    const writeStream = await rfs.createWriteStream(destinationPath); // Await the promise from createWriteStream
    fileStream.pipe(writeStream); // Pipe the stream to the write stream

    await writeStream.on('finish', async () => {
      // Use await with event listener
      const stats = await fs.stat(destinationPath); // Use fs.stat with await

      if (stats.size > FILE_SIZE_LIMIT) {
        throw new Error(`File size exceeds the limit of ${FILE_SIZE_LIMIT}`); // Re-throw with clear message
      }

      logger.success(`File ${fileName} uploaded successfully`);
      return {
        fileName,
        size: stats.size,
      }; // Return file information
    });

    writeStream.on('error', (err) => {
      logger.error('Error uploading file from URL:', err);
      // Clean up partially downloaded file (optional)
      // You can add logic here to remove the partially downloaded file if needed
      throw err; // Re-throw the error for handling in the controller
    });
  } catch (error) {
    logger.error('Error uploading file from URL:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

export { upload, uploadFromStream };
