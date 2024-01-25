const { NOT_FOUND } = require('../controllers/constants');
const { ReviewModel, UserModel, BookModel } = require('../models');

// Create a new review
const createReview = async (userId, bookId, comment, rating) => {
  try {
    const newReview = await ReviewModel.create({
      userId,
      bookId,
      comment,
      rating,
    });

    const bookInstance = await BookModel.findByPk(bookId);
    const avgRating = await bookInstance.calculateAverageRating(bookId);
    bookInstance.rating = avgRating;
    bookInstance.save()

    return newReview;
  } catch (e) {
    throw e;
  }
};

// Get all reviews for a specific book
const getReviewsByBookId = async (bookId) => {
  try {
    const reviews = await ReviewModel.findAll({
      where: { bookId },
      include: [{ model: UserModel, attributes: ['id', 'username'] }],
    });

    return reviews;
  } catch (e) {
    throw e;
  }
};

// Update an existing review
const updateReview = async (reviewId, updatedReviewData) => {
  try {
    const [rowsUpdated, [updatedReview]] = await ReviewModel.update(updatedReviewData, {
      where: { id: reviewId },
      returning: true,
    });

    if (rowsUpdated === 0) {
      const error = new Error(UPDATE_FAIL);
      error.status = 500;
      throw error;
    }

    return updatedReview;
  } catch (error) {
    throw error;
  }
};

// Patch a specific property of a review
const patchReviewProperty = async (reviewId, propertyName, propertyValue) => {
  try {
    const review = await ReviewModel.findByPk(reviewId);

    // Check if the provided property exists in the review model
    if (!review[propertyName] && review[propertyName] !== 0) {
      const error = new Error('Invalid property name');
      error.status = 400;
      throw error;
    }

    // Update the specified property dynamically
    review[propertyName] = propertyValue;

    // Save the updated review
    const updatedReview = await review.save();

    return updatedReview;
  } catch (error) {
    throw error;
  }
};

// Delete a review
const deleteReview = async (reviewId) => {
  try {
    const reviewToDelete = await ReviewModel.findByPk(reviewId);

    if (!reviewToDelete) {
      const error = new Error(NOT_FOUND);
      error.status = 404;
      throw error;
    }

    await reviewToDelete.destroy();

    return reviewToDelete;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createReview,
  getReviewsByBookId,
  updateReview,
  patchReviewProperty,
  deleteReview,
};



//? Get Reviews by Book ID

//? Update Review

//? Patch Review property

//? Delete Review
  
 
  