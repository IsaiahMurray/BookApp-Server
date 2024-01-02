const { DataTypes } = require('sequelize');
const db = require('../db');


const Book = db.define('book', {
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    titleFont: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contentFont: {
        type: DataTypes.STRING,
        allowNull: true
    },
    privacy: {
        type: DataTypes.ENUM('public', 'private', 'limited'),
        allowNull: false
    },
    hasRating: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        allowNull: true
    }
});

const Chapter = db.define('chapter', {
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

const Tag = db.define('tag', {
    tagName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {Book, Chapter, Tag};