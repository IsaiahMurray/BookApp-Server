const { DataTypes } = require('sequelize');
const db = require('../db');
const {UserModel, BookModel} = require('.'); 

const Review = db.define('review', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Define validation rules for the rating value (e.g., minimum value)
        max: 5, // Adjust the maximum rating value as needed
      },
    },
    comment: {
      type: DataTypes.TEXT, // You might use TEXT for longer comments
      allowNull: true, // Allow comments to be optional
    },
  });
  
  // Define associations between models
  Review.belongsTo(User); // A review belongs to a user
  Review.belongsTo(Book); // A review is associated with a book

  module.exports = Review;