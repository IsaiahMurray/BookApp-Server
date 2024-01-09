const Services = require("../services/index");
const BookController = require("express").Router();
const { ValidateSession, ValidateAdmin } = require("../middleware");

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
  NO_AUTH,
  BAD_REQ,
} = require("../controllers/constants");

//* Create Book
BookController.route("/create").post(ValidateSession, async (req, res) => {
  try {
    //Get the user id and user inputs
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

    // Call the service function to create a new chapter
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

    // Respond with a success message and the newly created chapter
    res.status(201).json({
      message: CREATE_SUCCESS,
      newBook,
    });
  } catch (e) {
    //Handle error
    if (e instanceof Error) {
      const errorMessage = {
        title: CREATE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.status(500).send(errorMessage);
    }
  }
});

//* Get All Books
BookController.route("/get/all").get(async (req, res) => {
  try {
    // Call the service function to get all books
    const allBooks = await Services.BookService.getAllBooks();

    // Respond with books if found
    res.status(200).json({
      message: GET_SUCCESS,
      allBooks,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 404) {
        // Not Found error (if no books found)
        res.status(404).json({
          title: NOT_FOUND,
          info: {
            message: e.message,
          },
        });
      } else {
        // Internal server error for other errors
        res.status(500).json({
          title: GET_FAIL,
          info: {
            message: e.message,
          },
        });
      }
    }
  }
});

//* Get All Books by User
BookController.route("/get/books/:userId").get(async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.userId;

    // Fetch books associated with the user
    const books = await Services.BookService.getBooksByUser(userId);

    // If no books found for the user, send 204 (No Content) response
    if (books.length === 0) {
      return res.status(204).end("No books found for the user.");
    }

    // If books are found, send a JSON response with the books
    res.status(200).json({
      message: "Books retrieved successfully",
      books,
    });
  } catch (error) {
    // Handle any caught errors
    res.status(500).json({
      title: "Failed to retrieve books",
      info: {
        message: error.message,
      },
    });
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
      res.status(500).send(errorMessage);
    }
  }
});

//* Update Book
BookController.route("/update/:bookId").put(
  ValidateSession,
  async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.user.id;
      const { ...updatedBookData } = req.body;

      const updatedBook = await Services.BookService.modifyBook(
        userId,
        bookId,
        updatedBookData
      );

      res.status(200).json({
        message: UPDATE_SUCCESS,
        updatedBook,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 404) {
          // Not Found error (if the book doesn't exist)
          res.status(404).json({
            title: NOT_FOUND,
            info: {
              message: e.message,
            },
          });
        } else if (e.status === 403) {
          // Not Authorized error (if the book doesn't belong to the user)
          res.status(403).json({
            title: NO_AUTH,
            info: {
              message: e.message,
            },
          });
        } else {
          // Internal server error for other errors
          res.status(500).json({
            title: DELETE_FAIL,
            info: {
              message: e.message,
            },
          });
        }
      }
    }
  }
);

//* Patch Book Property
BookController.route("/patch/:bookId").patch(
  ValidateSession,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const bookId = req.params.bookId;
      const { propertyName, propertyValue } = req.body;

      // Call the service function to edit the book
      const updatedBook = await Services.BookService.patchBookProperty(
        userId,
        bookId,
        propertyName,
        propertyValue
      );
      // Respond with a success message and the updated book
      res.status(200).json({
        message: UPDATE_SUCCESS,
        updatedBook,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 404) {
          // Not Found error (if the book doesn't exist)
          res.status(404).json({
            title: NOT_FOUND,
            info: {
              message: e.message,
            },
          });
        } else if (e.status === 403) {
          // Not Authorized error (if the book doesn't belong to the user)
          res.status(403).json({
            title: NO_AUTH,
            info: {
              message: e.message,
            },
          });
        } else if (e.status === 400) {
          // Bad Request error (if the book property doesn't exist or is misspelled)
          res.status(400).json({
            title: BAD_REQ,
            info: {
              message: e.message,
            },
          });
        } else {
          // Internal server error for other errors
          res.status(500).json({
            title: DELETE_FAIL,
            info: {
              message: e.message,
            },
          });
        }
      }
    }
  }
);

//* Delete Book
BookController.route("/delete/:bookId").delete(
  ValidateSession,
  async (req, res) => {
    try {
      const { bookId } = req.params;
      
      // Call the service function to delete the book
      const deletedBook = await Services.BookService.deleteBook(bookId);

      // Respond with a success message and the deleted book
      res.status(200).json({
        message: DELETE_SUCCESS,
        deletedBook,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 404) {
          // Not Found error (if the book doesn't exist)
          res.status(404).json({
            title: NOT_FOUND,
            info: {
              message: e.message,
            },
          });
        } else {
          // Internal server error for other errors
          res.status(500).json({
            title: DELETE_FAIL,
            info: {
              message: e.message,
            },
          });
        }
      }
    }
  }
);
module.exports = BookController;
