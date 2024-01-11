const Services = require("../services");
const ReviewController = require("express").Router();
const { ValidateSession, ValidateAdmin } = require("../middleware");
const {
  CREATE_SUCCESS,
  GET_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
  CREATE_FAIL,
  GET_FAIL,
  UPDATE_FAIL,
  DELETE_FAIL,
  CONTENT_EXISTS,
} = require("./constants");

//* Create a new review
ReviewController.route("/create/:bookId").post(
  ValidateSession,
  async (req, res) => {
    try {
      console.log(req);
      const userId = req.user.id;
      const { bookId } = req.params;
      const { comment, rating } = req.body;

      const newReview = await Services.ReviewService.createReview(
        userId,
        bookId,
        comment,
        rating
      );

      res.status(201).json({
        message: CREATE_SUCCESS,
        newReview,
      });
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        if (e.status == 409) {
          res.status(409).json({
            title: CONTENT_EXISTS,
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
  }
);

//* Get all reviews for a specific book
ReviewController.route("/get/:bookId").get(async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Services.ReviewService.getReviewsByBookId(bookId);

    if (reviews.length === 0) {
      return res.status(204).end("No reviews found for the book.");
    }

    res.status(200).json({
      message: GET_SUCCESS,
      reviews,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.status(500).json(errorMessage);
    }
  }
});

//* Update an existing review
ReviewController.route("/update/:reviewId").put(async (req, res) => {
  try {
    const { reviewId } = req.params;
    // Replace manual line breaks with '\n' escape sequence
    const formattedComment = req.body.comment.replace(/\r?\n|\r/g, "\\n");

    const updatedReviewData = {
      rating: req.body.rating,
      comment: formattedComment,
    };

    const updatedReview = await Services.ReviewService.updateReview(
      reviewId,
      updatedReviewData
    );

    res.status(200).json({
      message: UPDATE_SUCCESS,
      updatedReview,
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

//* Patch a specific property of a review
ReviewController.route("/patch/:reviewId").patch(async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { propertyName, propertyValue } = req.body;

    const patchedReview = await Services.ReviewService.patchReviewProperty(
      reviewId,
      propertyName,
      propertyValue
    );

    res.status(200).json({
      message: UPDATE_SUCCESS,
      patchedReview,
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

//* Delete a review
ReviewController.route("/delete/:reviewId").delete(ValidateAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Services.ReviewService.deleteReview(reviewId);

    res.status(200).json({
      message: DELETE_SUCCESS,
      deletedReview,
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: DELETE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.status(500).json(errorMessage);
    }
  }
});

module.exports = ReviewController;
