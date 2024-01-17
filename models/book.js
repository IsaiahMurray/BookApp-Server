const { DataTypes } = require("sequelize");
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
  },
  titleFont: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contentFont: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  privacy: {
    type: DataTypes.ENUM("public", "private", "limited"),
    allowNull: false,
  },
  canRate: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
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
  },
  coverPicture: {
    type: DataTypes.STRING, // Store the path or URL of the profile picture
    allowNull: true, // Allow the profile picture to be optional
  },
  allowedUsers: {
    // Store the IDs of users who have access to the book with the 'limited' property
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: []
  },
  archive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = BookModel;
