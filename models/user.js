const { DataTypes } = require("sequelize");
const db = require("../db");

const UserModel = db.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
  },
  readingList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  favorites: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: []
  },
  archiveAccount: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  profilePicture: {
    type: DataTypes.STRING, // Store the path or URL of the profile picture
    allowNull: true, // Allow the profile picture to be optional
  },
});

module.exports = UserModel;
