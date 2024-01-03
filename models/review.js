const { DataTypes } = require('sequelize');
const db = require('../db');

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
  
  module.exports = Review;