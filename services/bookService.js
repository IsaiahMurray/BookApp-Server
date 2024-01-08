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

//? Delete Book
const remove = async (id) => {
  try {
    const deletedBook = await BookModel.destroy({
      where: {
        id: id,
      },
    });
    return deletedBook;
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
  remove
};
