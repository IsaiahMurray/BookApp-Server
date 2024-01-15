const { BookModel, TagModel } = require("../models");
const { Op } = require("sequelize");

//? Create Book
const create = async ({ userId, bookData }) => {
  try {
    const newBook = await BookModel.create({ userId, ...bookData });

    return newBook;
  } catch (e) {
    throw e;
  }
};

//? Get All Books
const getAllBooks = async () => {
  try {
    // Retrieve all books from the database
    const allBooks = await BookModel.findAll();

    // Check if there are no books found
    if (!allBooks || allBooks.length === 0) {
      // If no books found, throw a 404 error
      const error = new Error("No books found");
      error.status = 404;
      throw error;
    }

    return allBooks;
  } catch (e) {
    throw e;
  }
};

//? Get All Books by User ID
const getBooksByUser = async (id) => {
  try {
    // Retrieve books associated with the given user ID
    const userBooks = await BookModel.findAll({
      where: {
        userId: id,
      },
    });

    return userBooks;
  } catch (e) {
    throw e;
  }
};

//? Get Book by ID
const getById = async (id) => {
  try {
    // Fetch the book by its primary key (ID)
    const book = await BookModel.findByPk(id);

    // Check if the book does not exist
    if (!book) {
      // If the book is not found, throw an error indicating the absence of the book
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }

    // If the book exists, return the book object
    return book;
  } catch (e) {
    throw e;
  }
};

//? Get books by tags
const getBooksByTags = async (tags) => {
  try {
    // Find tags with the given names
    const foundTags = await TagModel.findAll({
      where: {
        tagName: {
          [Op.in]: tags,
        },
      },
    });

    // Extract tag ids
    const tagIds = foundTags.map((tag) => tag.id);

    // Find books with the extracted tag ids
    const books = await BookModel.findAll({
      include: [
        {
          model: TagModel,
          as: "bookTags",
          where: {
            id: {
              [Op.in]: tagIds,
            },
          },
        },
      ],
    });

    return books;
  } catch (e) {
    throw e;
  }
};

//? Modify Book
const modifyBook = async (userId, bookId, updatedBookData) => {
  try {
    // Find the book to be updated
    const bookToUpdate = await BookModel.findByPk(bookId);

    // Check if the book exists
    if (!bookToUpdate) {
      // If the book does not exist, throw an error indicating the update failure
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }

    // Check if the book belongs to the user
    if (bookToUpdate.userId !== userId) {
      // If the book doesn't belong to the user, throw an error indicating access denial
      const error = new Error(
        "Access denied - Book does not belong to the user"
      );
      error.status = 403; // Forbidden status code
      throw error;
    }

    // Update the book with the provided data if it exists and belongs to the user
    const [rowsUpdated, [updatedBook]] = await BookModel.update(
      updatedBookData,
      {
        where: { id: bookId },
        returning: true, // To get the updated book data
      }
    );

    // Check if the book update failed
    if (rowsUpdated === 0) {
      // If the update fails, throw an error indicating the update failure
      const error = new Error("Book update failed");
      error.status = 500;
      throw error;
    }

    // Return the updated book object
    return updatedBook;
  } catch (error) {
    throw error;
  }
};

//? Patch Book Property
const patchBookProperty = async (
  userId,
  bookId,
  propertyName,
  propertyValue
) => {
  try {
    // Fetch the book by its ID
    const bookToUpdate = await BookModel.findByPk(bookId);

    // Check if the book exists
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404; // Set status to indicate resource not found
      throw error;
    }

    // Check if the book belongs to the user
    if (bookToUpdate.userId !== userId) {
      // If the book doesn't belong to the user, throw an error indicating access denial
      const error = new Error(
        "Access denied - Book does not belong to the user"
      );
      error.status = 403; // Forbidden status code
      throw error;
    }

    // Check if the provided property exists in the book model
    if (!bookToUpdate[propertyName] && bookToUpdate[propertyName] !== 0) {
      const error = new Error("Invalid property name");
      error.status = 400; // Set status to indicate a bad request due to an invalid property name
      throw error;
    }

    // Update the specified property dynamically
    bookToUpdate[propertyName] = propertyValue;

    // Save the updated book
    const updatedBook = await bookToUpdate.save();

    return updatedBook;
  } catch (error) {
    throw error;
  }
};

//? Delete Book
const deleteBook = async (bookId) => {
  try {
    // Find the book by its ID
    const bookToDelete = await BookModel.findByPk(bookId);

    // Check if the book exists
    if (!bookToDelete) {
      const error = new Error("Book not found");
      error.status = 404; // Set status to indicate resource not found
      throw error;
    }

    // Delete the book
    await bookToDelete.destroy();

    return bookToDelete;
  } catch (error) {
    throw error;
  }
};

//? Upload Cover Picture
const uploadCoverPicture = async (bookId, filePath) => {
  try {
    const uploaded = await BookModel.update(
      { coverPicture: filePath },
      { where: { id: bookId } }
    );

    return uploaded;
  } catch (e) {
    throw e;
  }
};

//? Remove Cover Picture
const removeCoverPicture = async (bookId) => {
  try {
    // Remove the cover picture by setting the value to null
    const removedPicture = await BookModel.update(
      { coverPicture: null },
      { where: { id: bookId } }
    );

    return removedPicture;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
  getBooksByUser,
  getById,
  getAllBooks,
  getBooksByTags,
  modifyBook,
  patchBookProperty,
  deleteBook,
  uploadCoverPicture,
  removeCoverPicture,
};
