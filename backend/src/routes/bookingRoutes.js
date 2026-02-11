const router = require('express').Router();
const {
  getMyBookings,
  getHostBookings,
  createBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');
const { bookingValidation } = require('../middlewares/validationMiddleware');

// Todas protegidas
router.get('/', authenticate, getMyBookings);
router.get('/host', authenticate, getHostBookings);
router.post('/', authenticate, bookingValidation, createBooking);
router.put('/:id/status', authenticate, updateBookingStatus);

module.exports = router;
