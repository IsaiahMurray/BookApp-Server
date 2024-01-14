const { BookService } = require("../services/index");
const BookController = require("express").Router();
const { ValidateSession, ValidateAdmin, Multer } = require("../middleware");
const fs = require("fs");
const path = require("path");
const { handleErrorResponse } = require("../services/helpers/errorHandler");

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
const { BookModel } = require("../models");
const { errorHandler } = require("../services/helpers");
const { NOTFOUND } = require("dns");

//* Create Book
BookController.route("/create").post(ValidateSession, async (req, res) => {
  try {
    //Get the user id and user inputs
    const userId = req.user.id;
    const { ...bookData } = req.body;

    // Call the service function to create a new chapter
    const newBook = await BookService.create({
      userId,
      bookData,
    });

    // Respond with a success message and the newly created chapter
    res.status(201).json({
      message: CREATE_SUCCESS,
      newBook,
    });
  } catch (e) {
    //Handle error
    if (e instanceof Error) {
      handleErrorResponse(res, 500, CREATE_FAIL, e.message);
    }
  }
});

//* Get All Books
BookController.route("/get/all").get(async (req, res) => {
  try {
    // Call the service function to get all books
    const allBooks = await BookService.getAllBooks();

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
        handleErrorResponse(res, 404, NOTFOUND, e.message);
      } else {
        // Internal server error for other errors
        handleErrorResponse(res, 500, GET_FAIL, e.message);
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
    const books = await BookService.getBooksByUser(userId);

    // If no books found for the user, send 204 (No Content) response
    if (books.length === 0) {
      handleErrorResponse(res, 204, NO_CONTENT, NO_CONTENT);
    }

    // If books are found, send a JSON response with the books
    res.status(200).json({
      message: GET_SUCCESS,
      books,
    });
  } catch (error) {
    // Handle any caught errors
    handleErrorResponse(res, 500, GET_FAIL, e.message);
  }
});

//* Get single Book
BookController.route("/get/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);

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

//* Get Books by tags
BookController.route("/get-tags").get(async (req, res) => {
  try {
    const { tags } = req.query;

    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({
        title: "Invalid request",
        info: {
          message: "Tags parameter must be an array",
        },
      });
    }

    const books = await BookService.getBooksByTags(tags);

    res.status(200).json({
      message: GET_SUCCESS,
      books,
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      });
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

      const updatedBook = await BookService.modifyBook(
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
      const updatedBook = await BookService.patchBookProperty(
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
  ValidateAdmin,
  async (req, res) => {
    try {
      const { bookId } = req.params;

      // Call the service function to delete the book
      const deletedBook = await BookService.deleteBook(bookId);

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

//* Upload Book Cover Picture
BookController.route("/upload/cover-picture/:bookId").patch(
  ValidateSession,
  Multer.single("bookCover"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;

      // Update the user's profilePicture in the database
      const uploadedPic = await BookService.uploadCoverPicture(
        bookId,
        req.file.path
      );

      res.status(200).json({
        uploadedPic,
        info: {
          message: UPDATE_SUCCESS,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = {
          title: UPDATE_FAIL,
          info: {
            message: e.message,
          },
        };
        res.send(errorMessage);
      }
    }
  }
);

//* Remove Book Cover Picture
BookController.route("/remove/cover-picture/:bookId").patch(
  ValidateSession,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;

      const book = await BookModel.findByPk(bookId);

      if (book && book.coverPicture) {
        const uploadsFolderPath = path.join(__dirname, "..");

        const previousProfilePicturePath = path.join(
          uploadsFolderPath,
          book.coverPicture
        );

        console.log(
          "Previous Profile Picture Path:",
          previousProfilePicturePath
        );

        // Check if the previous profile picture file exists
        if (fs.existsSync(previousProfilePicturePath)) {
          // Remove the previous profile picture file from the uploads folder
          fs.unlinkSync(previousProfilePicturePath);

          // Call the service function to remove the cover picture from the database
          const removedPic = await BookService.removeCoverPicture(bookId);

          // Check if the profilePicture has been set to null in the model
          const updatedBook = await BookModel.findByPk(bookId);
          if (updatedBook && updatedBook.coverPicture === null) {
            res.status(200).json({
              removedPic,
              info: {
                message: UPDATE_SUCCESS,
              },
            });
          } else {
            // If the profilePicture is not set to null in the model, handle accordingly
            res.status(500).json({
              title: UPDATE_FAIL,
              info: {
                message: "Failed to update profile picture in the database.",
              },
            });
          }
        } else {
          // If the file in the uploads folder doesn't exist, handle accordingly
          console.log(
            "Files in uploads folder:",
            fs.readdirSync(uploadsFolderPath)
          );
          res.status(404).json({
            title: UPDATE_FAIL,
            info: {
              message: "File not found in the uploads folder.",
            },
          });
        }
      } else {
        // If book or coverPicture is not found, handle accordingly
        res.status(404).json({
          title: UPDATE_FAIL,
          info: {
            message: "Book or cover picture not found.",
          },
        });
      }
    } catch (e) {
      // Handle other errors
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
  }
);

module.exports = BookController;
