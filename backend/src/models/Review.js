const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La valoración mínima es 1' },
      max: { args: [5], msg: 'La valoración máxima es 5' },
    },
  },
  comment: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
}, {
  timestamps: true,
  tableName: 'reviews',
});

module.exports = Review;
