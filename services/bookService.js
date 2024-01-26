const { NOT_FOUND } = require("../controllers/constants");
const { BookModel, TagModel, ReviewModel, ChapterModel } = require("../models");
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
const getAllBooks = async (userId) => {
  try {
    let whereClause = {};

    // If userId is provided, filter books based on privacy and allowedUsers
    if (userId && userId !== 0) {
      whereClause = {
        [Op.or]: [
          { privacy: { [Op.not]: "private" } }, // Exclude private books
          {
            privacy: "private",
            userId: userId, // Include private books if they belong to the logged-in user
          },
        ],
      };
    } else {
      // If no userId, only retrieve public books
      whereClause = { privacy: "public" };
    }

    // Retrieve all books from the database
    const allBooks = await BookModel.findAll({
      where: whereClause,
    });
    // Fetch chapters for each book
    const booksWithChapters = await Promise.all(
      allBooks.map(async (book) => {
        const chapters = await ChapterModel.findAll({
          where: { bookId: book.id },
        });
        return { ...book.toJSON(), chapters };
      })
    );

    // Check if there are no books found
    if (!allBooks || allBooks.length === 0) {
      // If no books found, throw a 404 error
      const error = new Error(NOT_FOUND);
      error.status = 404;
      throw error;
    }

    // If userId is provided and books are set to limited, filter based on allowedUsers
    if (userId) {
      const filteredBooks = booksWithChapters.filter((book) => {
        return (
          book.privacy !== "limited" || // Include books with privacy not set to 'limited'
          (book.privacy === "limited" && book.allowedUsers.includes(userId))
        );
      });

      return filteredBooks;
    }

    return booksWithChapters;
  } catch (e) {
    throw e;
  }
};

//? Get Books By User ID
const getBooksByUser = async (userId, loggedInUserId) => {
  try {
    let whereClause = { userId };

    // If loggedInUserId is provided and not the same as userId, filter books based on privacy and allowedUsers
    if (loggedInUserId && loggedInUserId !== userId) {
      whereClause = {
        userId,
        [Op.or]: [
          { privacy: { [Op.not]: "private" } }, // Exclude private books
          {
            privacy: "private",
            userId: loggedInUserId, // Include private books if they belong to the logged-in user
          },
        ],
      };
    }

    // Retrieve books by the specified user from the database
    const userBooks = await BookModel.findAll({
      where: whereClause,
    });

    // Check if there are no books found
    if (!userBooks || userBooks.length === 0) {
      // If no books found, throw a 404 error
      const error = new Error(NOT_FOUND);
      error.status = 404;
      throw error;
    }

    // If loggedInUserId is provided and books are set to limited, filter based on allowedUsers
    if (loggedInUserId && loggedInUserId !== userId) {
      const filteredUserBooks = userBooks.filter((book) => {
        return (
          book.privacy !== "limited" || // Include books with privacy not set to 'limited'
          (book.privacy === "limited" &&
            book.allowedUsers.includes(loggedInUserId))
        );
      });

      return filteredUserBooks;
    }

    return userBooks;
  } catch (e) {
    throw e;
  }
};

//? Get Book by ID
const getById = async (id) => {
  try {
    // Fetch the book by its primary key (ID)
    const book = await BookModel.findByPk(id, {
      include: {
        model: ReviewModel,
        where: {
          bookId: id,
        },
      },
    });

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
    // Find tags with the given IDs
    const foundTags = await TagModel.findAll({
      where: {
        id: {
          [Op.in]: tags,
        },
      },
    });

    // Extract tag ids
    const tagIds = foundTags.map(tag => {
      return tag.dataValues.id
    })

    // Find books with the extracted tag ids
    const books = await BookModel.findAll({
      where: {
        tags: {
          [Op.contains]: tagIds,
        },
      },
    });

console.log(books)
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
    if (!bookToUpdate) {
      const error = new Error(NOT_FOUND);
      error.status = 404; // Set status to indicate resource not found
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
