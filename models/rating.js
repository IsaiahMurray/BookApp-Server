const {DataTypes} = require('sequelize');
const db = require('../db');

const RatingModel = db.define('rating', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rate: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
})

module.exports = RatingModel;