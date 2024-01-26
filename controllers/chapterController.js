const { ChapterService } = require("../services/index");
const ChapterController = require("express").Router();
const { ChapterModel } = require("../models");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../services/helpers/responseHandler");
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
  NO_CONTENT,
} = require("../controllers/constants");

//* Create Chapter
ChapterController.route("/create/:bookId").post(async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;
    const { title, content, chapterNumber } = req.body;

    // Check if chapterNumber already exists for the given bookId
    const existingChapter = await ChapterModel.findOne({
      where: {
        bookId,
        chapterNumber,
      },
    });

    if (existingChapter) {
      // If a chapter with the same number exists, return a 409 Conflict error
      const error = new Error("Chapter number already exists for this book");
      error.status = 409; // Set a custom status code
      throw error;
    }

    // Call the service function to create a new chapter
    const newChapter = await ChapterService.createChapter({
      userId,
      bookId,
      title,
      content,
      chapterNumber,
    });

    // Respond with a success message and the newly created chapter
    handleSuccessResponse(res, 201, newChapter, CREATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      handleErrorResponse(res, e.status || 500, CREATE_FAIL, e.message);
    }
  }
});

//* Get Chapters by Book ID
ChapterController.route("/get/:bookId").get(async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find all chapters associated with the specified bookId
    const existingChapter = await ChapterModel.findAll({ where: { bookId } });

    // Check if no chapters were found for the given bookId
    if (!existingChapter || existingChapter.length === 0) {
      // If no chapters are found, create response
      handleSuccessResponse(
        res,
        204,
        NO_CONTENT,
        "No chapters found for this book"
      );
    }

    // Call the service function to get chapters by bookId
    const chapters = await ChapterService.getChaptersByBookId(bookId);

    // Respond with chapters if found
    handleSuccessResponse(res, 200, chapters, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle errors
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Update Chapter by ID
ChapterController.route("/update/:chapterId").put(
  ValidateSession,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { chapterId } = req.params;
      const { title, content, chapterNumber } = req.body;

      // Check if the chapter exists
      const existingChapter = await ChapterModel.findOne({
        where: {
          id: chapterId,
          userId, // Ensure the chapter belongs to the specified user
        },
      });

      if (!existingChapter) {
        const error = new Error(NOT_FOUND);
        error.status = 404; // Set the status code to 404 for resource not found
        throw error;
      }

      // Call the service function to update the chapter
      const updatedChapter = await ChapterService.updateChapter({
        chapterId,
        title,
        content,
        chapterNumber,
        userId,
      });

      // Respond with a success message and the updated chapter
      handleSuccessResponse(res, 200, updatedChapter, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

//* Delete Chapter by ID
ChapterController.route("/delete/:chapterId").delete(async (req, res) => {
  try {
    const chapterId = req.params.chapterId;

    // Call the service function to delete the chapter by chapterId
    const deletedChapter = await ChapterService.deleteChapter(chapterId);

    // Respond with a success message and the deleted chapter
    handleSuccessResponse(res, 200, deletedChapter, DELETE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      handleErrorResponse(res, e.status || 500, DELETE_FAIL, e.message);
    }
  }
});

module.exports = ChapterController;
