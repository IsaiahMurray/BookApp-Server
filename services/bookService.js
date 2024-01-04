const { BookModel } = require("../models");

//? Create Book
const create = async ({ author, userId, title, description, titleFont, contentFont, privacy, canRate, rating, tags, canReview }) => {
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

//? Get Book by Title
const getByTitle = async (title) => {
  try {
    const foundBook = await BookModel.findOne({ where: { title } });

    return foundBook;
  } catch (e) {
    throw e;
  }
};

//? Update Book Title
const modifyTitle = async (id, title) => {
  try {
    const updatedBook = await BookModel.update(
      {
        title: title,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedBook;
  } catch (e) {
    throw e;
  }
};

//? Update Book Description
const modifyDescription = async (id, description) => {
  try {
    const updatedBook = await BookModel.update(
      {
        description: description,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedBook;
  } catch (e) {
    throw e;
  }
};

//? Update Book Privacy
const modifyPrivacy = async (id, privacy) => {
  try {
    const updatedBook = await BookModel.update(
      {
        privacy: privacy,
      },
      {
        where: {
          id: id,
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
  modifyTitle,
  modifyDescription,
  modifyPrivacy,
  remove,
};
