const { DataTypes } = require('sequelize');
const db = require('../db');

const TagModel = db.define('tag', {
    tagName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = TagModel;