const { DataTypes } = require("sequelize");
const db = require("../db");

//Email
//Pass
//Username
//Role

const User = db.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Admin", "User"),
    allowNull: false,
  },
});

module.exports = { User };
