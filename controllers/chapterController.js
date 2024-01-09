const Services = require("../services/index");
const ChapterController = require("express").Router();
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
  CONFLICT,
} = require("../controllers/constants");

//* Create Chapter
ChapterController.route("/create/:bookId").post(async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;
      const { title, content, chapterNumber } = req.body;
  
      // Call the service function to create a new chapter
      const newChapter = await Services.ChapterService.createChapter({
        userId,
        bookId,
        title,
        content,
        chapterNumber,
      });
  
      // Respond with a success message and the newly created chapter
      res.status(201).json({
        message: CREATE_SUCCESS,
        newChapter,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 409) {
          // Conflict error (if the chapter number already exists)
          res.status(409).json({
            title: CONFLICT,
            info: {
              message: e.message,
            },
          });
        } else {
          // Internal server error for other errors
          res.status(500).json({
            title: CREATE_FAIL,
            info: {
              message: e.message,
            },
          });
        }
      }
    }
  });
  
  //* Get Chapters by Book ID
  ChapterController.route("/get/:bookId").get(async (req, res) => {
    try {
      const { bookId } = req.params;
  
      // Call the service function to get chapters by bookId
      const chapters = await Services.ChapterService.getChaptersByBookId(bookId);
  
      // Respond with chapters if found
      res.status(200).json({
        message: GET_SUCCESS,
        chapters,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 404) {
          // Not Found error (if no chapters found for the book)
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
  

//* Update Chapter by ID
ChapterController.route("/update/:chapterId").put(async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapterId } = req.params;
    const { title, content, chapterNumber } = req.body;

    // Call the service function to update the chapter
    const updatedChapter = await Services.ChapterService.updateChapter({
      chapterId,
      title,
      content,
      chapterNumber,
      userId
    });

    // Respond with a success message and the updated chapter
    res.status(200).json({
      message: UPDATE_SUCCESS,
      updatedChapter,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 404) {
        // Not Found error (if the chapter doesn't exist)
        res.status(404).json({
          title: NOT_FOUND,
          info: {
            message: e.message,
          },
        });
      } else {
        // Internal server error for other errors
        res.status(500).json({
          title: UPDATE_FAIL,
          info: {
            message: e.message,
          },
        });
      }
    }
  }
});

//* Delete Chapter by ID
ChapterController.route("/delete/:chapterId").delete(async (req, res) => {
    try {
      const chapterId = req.params.chapterId;
  
      // Call the service function to delete the chapter by chapterId
      const deletedChapter = await Services.ChapterService.deleteChapter(
        chapterId
      );
  
      // Respond with a success message and the deleted chapter
      res.status(200).json({
        message: DELETE_SUCCESS,
        deletedChapter,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status === 404) {
          // Not Found error (if the chapter doesn't exist)
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
  });
  

module.exports = ChapterController;
