const { TagService } = require("../services");
const TagController = require("express").Router();

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

//* Create Tag
TagController.route("/create").post(async (req, res) => {
  try {
    const { tagName } = req.body;

    const newTag = await TagService.createTag(tagName);

    res.status(201).json({
      message: CREATE_SUCCESS,
      newTag,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 409) {
        // Conflict error (if the tag already exists)
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

//* Get All Tags
TagController.route("/get").get(async (req, res) => {
  try {
    const tags = await TagService.getAllTags();

    res.status(200).json({
      message: GET_SUCCESS,
      tags,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 404) {
        // Not Found error (if no tags found)
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

//* Update Tag
TagController.route('/update/:tagId').put(async (req, res) => {
  try {
    const { tagId } = req.params;
    const { tagName } = req.body;

    const updatedTag = await TagService.updateTag(tagId, tagName);

    res.status(200).json({
      message: UPDATE_SUCCESS,
      updatedTag,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 404) {
        // Not Found error (if no tag found)
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

//* Delete Tag
TagController.route('/delete/:tagId').delete(async (req, res) => {
  try {
    const { tagId } = req.params;

    const deletedTag = await TagService.deleteTag(tagId);

    res.status(200).json({
      message: DELETE_SUCCESS,
      deletedTag,
    });
  } catch (e) {
    if (e instanceof Error) {
      // Handle different error scenarios
      if (e.status === 404) {
        // Not Found error (if no tag found)
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

module.exports = TagController;
