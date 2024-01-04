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
  rating,
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
      canRate,
      rating,
      tags,
      canReview,
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

//? Get Book by Title
const getByTitle = async (title) => {
  try {
    const foundBook = await BookModel.findOne({ where: { title } });

    return foundBook;
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
const modifyBook = async ({
  userId,
  authorId,
  title,
  description,
  titleFont,
  contentFont,
  privacy,
  canRate,
  rating,
  tags,
  canReview,
}) => {
  try {
    const updatedBook = await BookModel.update(
      {
        author: authorId,
        title: title,
        description: description,
        titleFont: titleFont,
        contentFont: contentFont,
        privacy: privacy,
        canRate: canRate,
        rating: rating,
        tags: tags,
        canReview: canReview,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    return updatedBook;
  } catch (e) {
    throw e;
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
  getByTitle,
  getById,
  getAllBooks,
  modifyBook,
  remove,
};
