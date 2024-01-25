const { DataTypes } = require("sequelize");
const ReviewModel = require("../models/review");
const db = require("../db");

const BookModel = db.define("book", {
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  titleFont: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Times New Roman, Arial, sans-serif",
  },
  contentFont: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Times New Roman, Arial, sans-serif",
  },
  privacy: {
    type: DataTypes.ENUM("public", "private", "limited"),
    allowNull: false,
    defaultValue: "public",
  },
  canRate: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  rating: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: [],
  },
  canReview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  coverPicture: {
    type: DataTypes.STRING, // Store the path or URL of the profile picture
    allowNull: true, // Allow the profile picture to be optional
    // defaultValue: "uploads\bookCover-1705509545472-955003499.avif"
  },
  allowedUsers: {
    // Store the IDs of users who have access to the book with the 'limited' property
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: [],
  },
  archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Define a method to get reviews for a book
BookModel.prototype.getReviews = async () => {
  try {
    const reviews = await ReviewModel.findAll({
      where: {
        bookId: 1, // Use the book's id to filter reviews
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

BookModel.prototype.calculateAverageRating = async (id) => {
  const bookInstance = await BookModel.findByPk(id);

  const reviews = await bookInstance.getReviews(); // Assuming you have a getReviews method

  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  } else {
    return null; // Return null if there are no reviews
  }
};

module.exports = BookModel;
