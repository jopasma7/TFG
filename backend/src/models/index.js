const sequelize = require('../config/database');
const User = require('./User');
const Listing = require('./Listing');
const Booking = require('./Booking');
const Review = require('./Review');

// ===========================
// RELACIONES DE LOS MODELOS
// ===========================

// Un usuario tiene muchos alojamientos (como anfitrión)
User.hasMany(Listing, { foreignKey: 'hostId', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

// Un usuario tiene muchas reservas (como huésped)
User.hasMany(Booking, { foreignKey: 'guestId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'guestId', as: 'guest' });

// Un alojamiento tiene muchas reservas
Listing.hasMany(Booking, { foreignKey: 'listingId', as: 'bookings' });
Booking.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// Un usuario puede escribir muchas reseñas
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Un alojamiento tiene muchas reseñas
Listing.hasMany(Review, { foreignKey: 'listingId', as: 'reviews' });
Review.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  Listing,
  Booking,
  Review,
  syncDatabase,
};
