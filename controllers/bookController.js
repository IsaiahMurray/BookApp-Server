const Services = require("../services/index");
const BookController = require("express").Router();
const { ValidateSession } = require("../middleware");

// Constants for error messages or success messages are imported from a separate file
const {
  CREATE_SUCCESS,
  CREATE_FAIL,
  GET_SUCCESS,
  GET_FAIL,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE_FAIL,
  DELETE_SUCCESS,
  NOT_FOUND,
} = require("../controllers/constants");

//* Create Book
BookController.route("/create").post(ValidateSession, async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id;
    const {
      author,
      title,
      description,
      titleFont,
      contentFont,
      privacy,
      canRate,
      rating,
      tags,
      canReview,
    } = req.body;

    const newBook = await Services.BookService.create({
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

    res.status(200).json({
      message: CREATE_SUCCESS,
      newBook,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: CREATE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Get All Books
BookController.route("/get/all").get(async (req, res) => {
  try {
    const allBooks = await Services.BookService.getAllBooks();

    res.status(200).json({
      message: GET_SUCCESS,
      allBooks,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Get All Books by User
BookController.route("/get/books/:userId").get(async (req, res) => {
  try {
    const userId = req.params.userId;
    const books = await Services.BookService.getBooksByUser(userId);

    if (books.length === 0) {
      return res.status(204).end("No books found for the user.");
    }

    res.status(200).json({
      message: GET_SUCCESS,
      books,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Get single Book
BookController.route("/get/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Services.BookService.getById(id);

    res.status(200).json({
      message: GET_SUCCESS,
      book,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Update Book
BookController.route("/update/:bookId").put(ValidateSession, async (req, res) => {
    try {
        const {bookId} = req.params;
        const requestUserId = req.user.id;
        const {...updatedBookData } = req.body;
        
        const book = await Services.BookService.getById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.userId !== requestUserId) {
            return res.status(403).json({ message: 'Unauthorized to update this book' });
        }

        const updatedBook = await Services.BookService.modifyBook(bookId, updatedBookData);

        res.status(200).json({
            message: 'Book updated successfully',
            updatedBook
        });
    } catch (e) {
        if (e instanceof Error) {
            const errorMessage = {
                title: UPDATE_FAIL,
                info: {
                    message: e.message,
                },
            };
            res.status(500).json(errorMessage);
        }
    }
});

//* Patch Book
BookController.route("/patch/:bookId").patch(async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { propertyName, propertyValue } = req.body;

        const updatedBook = await Services.BookService.patchBookProperty(bookId, propertyName, propertyValue);

        res.status(200).json({
            message: 'Book property updated successfully',
            updatedBook
        });
    } catch (e) {
        if (e instanceof Error) {
            const errorMessage = {
                title: 'Update Failed',
                info: {
                    message: e.message,
                },
            };
            res.status(500).json(errorMessage);
        }
    }
});

//! Delete Book
BookController.route("/delete").delete(async (req, res) => {
  try {
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: DELETE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});
module.exports = BookController;