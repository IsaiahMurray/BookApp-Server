const { TagModel } = require("../models");

// Create a new tag
const createTag = async (tagName) => {
  try {
    // Check if a tag with the same name already exists
    const existingTag = await TagModel.findOne({
      where: {
        tagName,
      },
    });

    if (existingTag) {
      const error = new Error("Tag with the same name already exists");
      error.status = 409;
      throw error;
    }

    // Create a new tag if it doesn't exist
    const newTag = await TagModel.create({
      tagName,
    });

    return newTag;
  } catch (e) {
    throw e;
  }
};

// Get all tags
const getAllTags = async () => {
  try {
    const tags = await TagModel.findAll();
    // Check if no chapters were found for the given bookId
    if (!tags || tags.length === 0) {
      // If no chapters are found, create an error object
      const error = new Error("No tags have been created");
      error.status = 404; // Set the status code to 404 for resource not found
      throw error; // Throw the error to handle it further
    }
    return tags;
  } catch (e) {
    throw e;
  }
};

// Update a tag by ID
const updateTag = async (tagId, newName) => {
  try {
    // Find the tag to be updated
    const tagToUpdate = await TagModel.findByPk(tagId);

    // Check if the tag exists
    if (!tagToUpdate) {
      const error = new Error("Tag not found");
      error.status = 404;
      throw error;
    }

    // Update the tag with the new name
    tagToUpdate.tagName = newName;

    // Save the updated tag
    const updatedTag = await tagToUpdate.save();

    return updatedTag;
  } catch (e) {
    throw e;
  }
};

// Delete a tag by ID
const deleteTag = async (tagId) => {
  try {
    const tagToDelete = await TagModel.findByPk(tagId);

    // Check if the tag exists
    if (!tagToDelete) {
      const error = new Error("Tag not found");
      error.status = 404;
      throw error;
    }

    await tagToDelete.destroy();

    return tagToDelete;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
};
