const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es obligatorio' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('apartment', 'house', 'room'),
    allowNull: false,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'El precio debe ser mayor a 0' },
    },
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    defaultValue: null,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    defaultValue: null,
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de amenidades: wifi, parking, piscina, etc.',
    get() {
      const val = this.getDataValue('amenities');
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      return val || [];
    },
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array de URLs de imágenes',
    get() {
      const val = this.getDataValue('images');
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      return val || [];
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  averageRating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'listings',
});

module.exports = Listing;
