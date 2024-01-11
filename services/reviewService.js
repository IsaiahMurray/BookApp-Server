const { ReviewModel, UserModel } = require('../models');

// Create a new review
const createReview = async (userId, bookId, comment, rating) => {
  try {
    console.log(userId, bookId, comment, rating)
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
    const newReview = await ReviewModel.create({
      userId,
      bookId,
      comment,
      rating,
    });

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
      // Check if the review exists
      const existingReview = await ReviewModel.findOne({
        where: {
            id: reviewId
        }
    });

    if (!existingReview) {
        const error = new Error('Review not found');
        error.status = 404; // Set the status code to 404 for resource not found
        throw error;
    }
  
    const [rowsUpdated, [updatedReview]] = await ReviewModel.update(updatedReviewData, {
      where: { id: reviewId },
      returning: true,
    });

    if (rowsUpdated === 0) {
      throw new Error('Review update failed');
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

    if (!review) {
      throw new Error('Review not found');
    }

    // Check if the provided property exists in the review model
    if (!review[propertyName] && review[propertyName] !== 0) {
      throw new Error('Invalid property name');
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
      throw new Error('Review not found');
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
  
 
  