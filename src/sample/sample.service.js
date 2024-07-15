import logger from '../common/logger.js';
import * as SampleModel from './sample.model.js';

// Service functions to encapsulate business logic and interact with the model

async function createSample(sampleData) {
  try {
    const id = await SampleModel.createSample(sampleData);
    logger.success(`Sample created successfully with ID: ${id}`);
    return id;
  } catch (error) {
    logger.error('Error creating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function getAllSamples() {
  try {
    const samples = await SampleModel.getAllSamples();
    logger.info('All samples retrieved');
    return samples;
  } catch (error) {
    logger.error('Error getting samples:', error);
    throw error;
  }
}

async function getSampleById(id) {
  try {
    const sample = await SampleModel.getSampleById(id);
    if (!sample) {
      return null; // Handle case where sample is not found (optional)
    }
    logger.info(`Sample with id ${id} retrieved`);
    return sample;
  } catch (error) {
    logger.error('Error getting sample by ID:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function updateSample(id, updatedData) {
  try {
    const sample = await getSampleById(id);
    const modifiedCount = await SampleModel.updateSample(id, updatedData);
    if (modifiedCount === 0) {
      return { sample, modifiedCount }; // Handle case where sample is not found or is identical to the request body
    }
    logger.success(`Sample with id ${id} updated/replaced using PUT operation`);
    return { message: 'Sample updated successfully' }; // Return a success message (optional)
  } catch (error) {
    logger.error('Error updating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function deleteSample(id) {
  try {
    const deletedCount = await SampleModel.deleteSample(id);
    if (deletedCount === 0) {
      return null; // Handle case where sample is not found (optional)
    }
    logger.info(`Sample with id ${id} deleted`);
    return { message: 'Sample deleted successfully' }; // Return a success message (optional)
  } catch (error) {
    logger.error('Error deleting sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

export {
  createSample,
  getAllSamples,
  getSampleById,
  updateSample,
  deleteSample,
};
