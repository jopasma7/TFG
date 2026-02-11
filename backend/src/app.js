const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Importar middleware de errores
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// ========================
// MIDDLEWARES GLOBALES
// ========================
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes subidas como archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========================
// RUTAS
// ========================
app.get('/api', (req, res) => {
  res.json({
    message: 'API TFG Viajes - Bienvenido',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      listings: '/api/listings',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      upload: '/api/upload',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// ========================
// MANEJO DE ERRORES
// ========================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
