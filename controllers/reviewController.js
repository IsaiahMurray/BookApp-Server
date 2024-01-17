const { ReviewService } = require("../services");
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
  NO_CONTENT,
  NOT_FOUND,
} = require("./constants");
const { handleSuccessResponse, handleErrorResponse } = require("../services/helpers/responseHandler");

//* Create a new review
ReviewController.route("/create/:bookId").post(
  ValidateSession,
  async (req, res) => {
    try {
      console.log(req);
      const userId = req.user.id;
      const { bookId } = req.params;
      const { comment, rating } = req.body;

            // Check if the user has already reviewed the book
    const existingReview = await ReviewModel.findOne({
      where: {
        userId,
        bookId,
      },
    });

    // Throw a 409 conflict
    if (existingReview) {
      const error = new Error('User has already reviewed this book');
      error.status = 409;
      throw error;
    }
      const newReview = await ReviewService.createReview(
        userId,
        bookId,
        comment,
        rating
      );

      handleSuccessResponse(res, 201, newReview, CREATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        // Handle different error scenarios
        handleErrorResponse(res, e.status || 500, CREATE_FAIL, e.message);
      }
    }
  }
);

//* Get all reviews for a specific book
ReviewController.route("/get/:bookId").get(async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await ReviewService.getReviewsByBookId(bookId);

    if (reviews.length === 0) {
      handleSuccessResponse(res, 204, NO_CONTENT, "No reviews found for the book.");
    }

    handleSuccessResponse(res, 200, reviews, GET_SUCCESS)
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Update an existing review
ReviewController.route("/update/:reviewId").put(async (req, res) => {
  try {
    const { reviewId } = req.params;

          // Check if the review exists
          const existingReview = await ReviewModel.findOne({
            where: {
                id: reviewId
            }
        });
    
        if (!existingReview) {
            const error = new Error(NOT_FOUND);
            error.status = 404; // Set the status code to 404 for resource not found
            throw error;
        }

    // Replace manual line breaks with '\n' escape sequence
    const formattedComment = req.body.comment.replace(/\r?\n|\r/g, "\\n");

    const updatedReviewData = {
      rating: req.body.rating,
      comment: formattedComment,
    };

    const updatedReview = await ReviewService.updateReview(
      reviewId,
      updatedReviewData
    );

    handleSuccessResponse(res, 200, updatedReview, UPDATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
    }
  }
});

//* Patch a specific property of a review
ReviewController.route("/patch/:reviewId").patch(async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { propertyName, propertyValue } = req.body;

    const review = await ReviewModel.findByPk(reviewId);

    if (!review) {
      const error = new Error(NOT_FOUND);
      error.status = 404;
      throw error;
    }

    const patchedReview = await ReviewService.patchReviewProperty(
      reviewId,
      propertyName,
      propertyValue
    );

    handleSuccessResponse(res, 200, patchedReview, UPDATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
    }
  }
});

//* Delete a review
ReviewController.route("/delete/:reviewId").delete(
  ValidateAdmin,
  async (req, res) => {
    try {
      const { reviewId } = req.params;

      const deletedReview = await ReviewService.deleteReview(reviewId);

      handleSuccessResponse(res, 200, deletedReview, DELETE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        handleErrorResponse(res, e.status || 500, DELETE_FAIL, e.message);
      }
    }
  }
);

module.exports = ReviewController;