const { TagService } = require("../services");
const TagController = require("express").Router();
const { ValidateAdmin, ValidateSession } = require("../middleware");

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

} = require("../controllers/constants");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../services/helpers/responseHandler");

//* Create Tag
TagController.route("/create").post(ValidateAdmin, async (req, res) => {
  try {
    const { tagName } = req.body;

    const newTag = await TagService.createTag(tagName);

    handleSuccessResponse(res, 201, newTag, CREATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      handleErrorResponse(res, e.status, CREATE_FAIL, e.message);
    }
  }
});

//* Get All Tags
TagController.route("/get").get(async (req, res) => {
  try {
    const tags = await TagService.getAllTags();

    handleSuccessResponse(res, 200, tags, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Update Tag
TagController.route("/update/:tagId").put(ValidateAdmin, async (req, res) => {
  try {
    const { tagId } = req.params;
    const { tagName } = req.body;

    const updatedTag = await TagService.updateTag(tagId, tagName);

    handleSuccessResponse(res, 200, updatedTag, UPDATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
    }
  }
});

//* Delete Tag
TagController.route("/delete/:tagId").delete(
  ValidateAdmin,
  async (req, res) => {
    try {
      const { tagId } = req.params;

      const deletedTag = await TagService.deleteTag(tagId);

      handleSuccessResponse(res, 200, deletedTag, DELETE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, DELETE_FAIL, e.message);
      }
    }
  }
);

//* Add Tags to Book
TagController.route("/add/:bookId/tags").patch(
  ValidateSession,
  ValidateAdmin,
  async (req, res) => {
    try {
      const { bookId } = req.params;
      const { tagIds } = req.body;

      const result = await TagService.addMultipleTagsToBook(bookId, tagIds);

      handleSuccessResponse(res, 200, result, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

//* Remove Tags from Book
TagController.route("/remove/:bookId/tags").patch(
  ValidateSession,
  ValidateAdmin,
  async (req, res) => {
    try {
      const { bookId } = req.params;
      const { tagIds } = req.body;

      const result = await TagService.removeMultipleTagsFromBook(
        bookId,
        tagIds
      );

      handleSuccessResponse(res, 200, result, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
      }
    }
  }
);

module.exports = TagController;
