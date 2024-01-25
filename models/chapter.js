const { DataTypes } = require("sequelize");
const db = require("../db");

const ChapterModel = db.define("chapter", {
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chapterNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    }, 
})

module.exports = ChapterModel;