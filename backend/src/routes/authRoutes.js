const router = require('express').Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { registerValidation, loginValidation } = require('../middlewares/validationMiddleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
