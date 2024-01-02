const { DataTypes } = require('sequelize');
const db = require('../db');
const UserModel = require('./user'); 


const BookModel = db.define('book', {
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

const TagModel = db.define('tag', {
    tagName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

BookModel.belongsTo(UserModel, { foreignKey: 'userId' });
ChapterModel.belongsTo(BookModel, { foreignKey: 'bookId' });
BookModel.belongsToMany(TagModel, { through: 'BookTags' });
TagModel.belongsToMany(BookModel, { through: 'BookTags' });

module.exports = {BookModel, ChapterModel, TagModel};