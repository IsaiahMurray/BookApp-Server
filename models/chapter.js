const { DataTypes } = require('sequelize');
const db = require('../db');

const ChapterModel = db.define('chapter', {
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chapterNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ChapterModel;