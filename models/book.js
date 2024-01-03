const { DataTypes } = require('sequelize');
const db = require('../db');
const UserModel = require('./user'); 


const BookModel = db.define('book', {
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
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
    canRate: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        allowNull: true
    },
    canReview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    
});

module.exports = BookModel;