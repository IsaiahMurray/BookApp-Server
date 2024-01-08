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
    console.log(req.user)
    const userId = req.user.id;
    const {author, title, description, titleFont, contentFont, privacy, canRate, rating, tags, canReview} = req.body;

    const newBook = await Services.BookService.create({author,
        userId,
        title,
        description,
        titleFont,
        contentFont,
        privacy,
        canRate,
        rating,
        tags,
        canReview})
        
        res.status(200).json({
            message: CREATE_SUCCESS,
            newBook
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
        allBooks
    })
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
            books
        })
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
//! Get single Book
BookController.route("get/:id").get(async (req, res) => {
    try {
    
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
//! Update Book
BookController.route("update/:id").put(async (req, res) => {
    try {
        const {author, title, description, titleFont, contentFont, privacy, canRate, rating, tags, } = req.body;
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
});

//! Patch Book
BookController.route("patch/:id").patch(async (req, res) => {
    try {
    
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
