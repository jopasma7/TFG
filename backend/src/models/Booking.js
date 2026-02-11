const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
}, {
  timestamps: true,
  tableName: 'bookings',
});

module.exports = Booking;
