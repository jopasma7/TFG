const router = require('express').Router();
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');
const { authenticate } = require('../middlewares/authMiddleware');
const { listingValidation } = require('../middlewares/validationMiddleware');

// Públicas
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protegidas (requieren autenticación)
router.post('/', authenticate, listingValidation, createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);

module.exports = router;
