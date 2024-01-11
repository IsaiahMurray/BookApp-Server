const { TagModel, BookModel } = require("../models");

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

const getAllTags = async () => {
  try {
    const tags = await TagModel.findAll();

    // Check if no tags were found
    if (!tags || tags.length === 0) {
      // If no tags are found, create an error object
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

// Add multiple Tags to a Book
const addMultipleTagsToBook = async (bookId, tagIds) => {
  try {
    // Find the book
    console.log(tagIds)
    const book = await BookModel.findByPk(bookId);
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
  
    

    if (!book.tags || book.tags.length === 0) {
      // Book has no tags
      console.log('Book has no tags');

      book.tags = [...tagIds];

      console.log(book.tags)
      const updatedBook = await book.save();

      return updatedBook;
    } else {
      // Book has tags
      console.log('Book has tags');

      const tagArr = [...tagIds, ...book.tags];
      updatedArr = [...new Set(tagArr)];

      console.log("updatedArr");

      const updatedBook = await book.save();

      return updatedBook;
    }

    // Filter out dupes
    // const names = ['John', 'Paul', 'George', 'Ringo', 'John'];

    // let unique = [...new Set(names)];
  } catch (error) {
    throw error;
  }
};

// Remove multiple Tags from a Book
const removeMultipleTagsFromBook = async (bookId, tagIds) => {
  try {
    const book = await BookModel.findByPk(bookId);

    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }

    const tagsToRemove = await TagModel.findAll({
      where: {
        id: tagIds,
      },
    });

    await book.removeTags(tagsToRemove);

    return `Tags removed from book with ID ${bookId} successfully.`;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
  addMultipleTagsToBook,
  removeMultipleTagsFromBook,
};
