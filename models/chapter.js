const { DataTypes } = require('sequelize');
const db = require('../db');

const ChapterModel = db.define('chapter', {
    bookId: {
        type: DataTypes.NUMBER,
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
        type: DataTypes.NUMBER,
        allowNull: false
    }
});

module.exports = ChapterModel;