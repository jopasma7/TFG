const router = require('express').Router();
const {
  getListingReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/authMiddleware');
const { reviewValidation } = require('../middlewares/validationMiddleware');

// Pública
router.get('/listing/:listingId', getListingReviews);

// Protegidas
router.post('/', authenticate, reviewValidation, createReview);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
