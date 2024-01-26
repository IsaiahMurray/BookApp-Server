const { BookService } = require("../services/index");
const BookController = require("express").Router();
const {
  ValidateSession,
  ValidateAdmin,
  Multer,
  LoginCheck,
} = require("../middleware");
const fs = require("fs");
const path = require("path");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../services/helpers/responseHandler");
const { BookModel, ReviewModel } = require("../models");

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
  NO_CONTENT,
} = require("../controllers/constants");

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
    handleSuccessResponse(res, 201, newBook, CREATE_SUCCESS);
  } catch (e) {
    //Handle error
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, CREATE_FAIL, e.message);
    }
  }
});

//* Get All Books
BookController.route("/get/all").get(LoginCheck, async (req, res) => {
  try {
    let userId;

    if(req.user){
      userId = req.user.id;
    } else {
      userId = 0;
    }
    // Call the service function to get all books
    const allBooks = await BookService.getAllBooks(userId);

    // Check if there are no books found
    if (!allBooks || allBooks.length === 0) {
      // If no books found, throw a 404 error
      handleSuccessResponse(res, 204, NOT_FOUND, NO_CONTENT);
    }

    // Respond with books if found
    handleSuccessResponse(res, 200, allBooks, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
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
      handleSuccessResponse(res, 204, NO_CONTENT, NO_CONTENT);
    }

    // If books are found, send a JSON response with the books
    handleSuccessResponse(res, 200, books, GET_SUCCESS);
  } catch (e) {
    // Handle different error scenarios
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
  
  }
});

//* Get single Book
BookController.route("/get/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);

    handleSuccessResponse(res, 200, book, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
      
    }
  }
});

//* Get Books by tags
BookController.route("/get-tags").get(async (req, res) => {
  try {
    const { tags } = req.query;

    if (!tags || !Array.isArray(tags)) {
      const error = new Error("Tags parameter must be an array");
      error.status = 400;
    }

    const books = await BookService.getBooksByTags(tags);

    if (books.length == 0) {
      handleSuccessResponse(res, 204, books, NO_CONTENT);
    }
    handleSuccessResponse(res, 200, books, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Update Book
BookController.route("/update/:bookId").put(
  ValidateSession,
  ValidateAdmin,
  async (req, res) => {
    try {
      console.log(req.body)
      const { bookId } = req.params;
      const userId = req.user.id;
      const { ...updatedBookData } = req.body;

      const updatedBook = await BookService.modifyBook(
        userId,
        bookId,
        updatedBookData
      );

      handleSuccessResponse(res, 200, updatedBook, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
          handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

//* Patch Book Property
BookController.route("/patch/:bookId").patch(
  ValidateSession,
  ValidateAdmin,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;
      const { propertyName, propertyValue } = req.body;

      // Call the service function to edit the book
      const updatedBook = await BookService.patchBookProperty(
        userId,
        bookId,
        propertyName,
        propertyValue
      );
      // Respond with a success message and the updated book
      handleSuccessResponse(res, 200, updatedBook, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
          handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
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
      handleSuccessResponse(res, 200, deletedBook, DELETE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
          handleErrorResponse(res, e.status || 500, DELETE_FAIL, e.message);
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
      const { bookId } = req.params;

      // Update the user's profilePicture in the database
      const uploadedPic = await BookService.uploadCoverPicture(
        bookId,
        req.file.path
      );

      handleSuccessResponse(res, 200, uploadedPic, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

//* Remove Book Cover Picture
BookController.route("/remove/cover-picture/:bookId").patch(
  ValidateSession,
  ValidateAdmin,
  async (req, res) => {
    try {
      const { bookId } = req.params;

      const book = await BookModel.findByPk(bookId);

      if (book && book.coverPicture) {
        const uploadsFolderPath = path.join(__dirname, "..");

        const previousProfilePicturePath = path.join(
          uploadsFolderPath,
          book.coverPicture
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
            handleSuccessResponse(res, 200, removedPic, UPDATE_SUCCESS);
          } else {
            // If the profilePicture is not set to null in the model, handle accordingly
            const error = new Error("Could not remove picture.");
            error.status = 500;
            throw error;
          }
        } else {
          // If the file in the uploads folder doesn't exist, handle accordingly
          console.log(
            "Files in uploads folder:",
            fs.readdirSync(uploadsFolderPath)
          );
          const error = new Error(NOT_FOUND);
          error.status = 404;
          throw error;
        }
      } else {
        // If book or coverPicture is not found, handle accordingly
        const error = new Error(NOT_FOUND);
        error.status = 404;
        throw error;
      }
    } catch (e) {
      // Handle other errors
      if (e instanceof Error) {
          handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

module.exports = BookController;
