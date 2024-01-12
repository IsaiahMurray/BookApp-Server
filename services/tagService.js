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
    const book = await BookModel.findByPk(bookId);

    // If no book, throw not found
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }

    // Check if the Book has no tags or is set to null
    if (!book.tags || book.tags.length === 0) {
      // Set the tags and save the Book
      book.tags = [...tagIds];
      const updatedBook = await book.save();

      return updatedBook;
    } else {
      // Book has tags
      // Combine the new tagIds and the current tags on the book
      let tagArr = [...tagIds, ...book.tags];

      // Filter out any duplicates and save
      book.tags = [...new Set(tagArr)];
      const updatedBook = await book.save();

      return updatedBook;
    }
  } catch (error) {
    throw error;
  }
};

// Remove multiple Tags from a Book
const removeMultipleTagsFromBook = async (bookId, tagIds) => {
  try {
    const book = await BookModel.findByPk(bookId);
console.log(book)
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
    
    function removeSimilarValues(array1, array2) {
      // Ensure both arrays are provided
      if (!Array.isArray(array1) || !Array.isArray(array2)) {
        throw new Error("Both parameters must be arrays");
      }
      
      // Filter out values in array2 that are present in array1
      const filteredArray2 = array2.filter((value) => !array1.includes(value));
      
      return filteredArray2;
    }
    
    const newTags = removeSimilarValues(tagIds, book.tags);
    console.log("new tags", newTags);
    book.tags = [...newTags];

    console.log("New book", book)

    const updatedBook = await book.save();

    return updatedBook;
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
