const { BookModel } = require("../models");

//? Create Book
const create = async ({
  author,
  userId,
  title,
  description,
  titleFont,
  contentFont,
  privacy,
  canRate,
  tags,
  canReview,
}) => {
  try {
    const newBook = await BookModel.create({
      author,
      userId,
      title,
      description,
      titleFont,
      contentFont,
      privacy,
      tags,
      canReview,
      canRate
    });

    return newBook;
  } catch (e) {
    throw e;
  }
};

//? Get All Books
const getAllBooks = async () => {
  try {
    const allBooks = await BookModel.findAll();

    return allBooks;
  } catch (e) {
    throw e;
  }
};

//? Get All Books by User ID
const getBooksByUser = async (id) => {
  try {
    const allBooks = await BookModel.findAll({
      where: {
        userId: id
      }
    });

    return allBooks;
  } catch (e) {
    throw e;
  }
};

//? Get Book by ID
const getById = async (id) => {
  try {
    const book = await BookModel.findByPk(id);

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  } catch (e) {
    throw e;
  }
};

//? Modify Book
const modifyBook = async (bookId, updatedBookData) => {
  try {
    const [rowsUpdated, [updatedBook]] = await BookModel.update(updatedBookData, {
      where: { id: bookId },
      returning: true, // To get the updated book data
    });

    if (rowsUpdated === 0) {
      throw new Error('Book update failed');
    }

    return updatedBook;
  } catch (error) {
    throw error;
  }
};

//? Patch Book Property
const patchBookProperty = async (bookId, propertyName, propertyValue) => {
  try {
    // Fetch the book by its ID
    const book = await BookModel.findByPk(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    // Check if the provided property exists in the book model
    if (!book[propertyName] && book[propertyName] !== 0) {
      throw new Error('Invalid property name');
    }

    // Update the specified property dynamically
    book[propertyName] = propertyValue;

    // Save the updated book
    const updatedBook = await book.save();

    return updatedBook;
  } catch (error) {
    throw error;
  }
};

//? Delete Book
const deleteBook = async (bookId) => {
  try {
      const bookToDelete = await BookModel.findByPk(bookId);

    if (!bookToDelete) {
      throw new Error('Book not found');
    }

    await bookToDelete.destroy();

    return bookToDelete;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
  getBooksByUser,
  getById,
  getAllBooks,
  modifyBook,
  patchBookProperty,
  deleteBook
};
