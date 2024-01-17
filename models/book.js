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
    defaultValue: ""
  },
  titleFont: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Times New Roman, Arial, sans-serif"
  },
  contentFont: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Times New Roman, Arial, sans-serif"
  },
  privacy: {
    type: DataTypes.ENUM("public", "private", "limited"),
    allowNull: false,
    defaultValue: "public"
  },
  canRate: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
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
    defaultValue: true
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
