const { body, validationResult } = require('express-validator');

// Procesar errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validaciones de registro
const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidation,
];

// Validaciones de login
const loginValidation = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  handleValidation,
];

// Validaciones de alojamiento
const listingValidation = [
  body('title').trim().notEmpty().withMessage('El título es obligatorio'),
  body('description').trim().notEmpty().withMessage('La descripción es obligatoria'),
  body('type')
    .isIn(['apartment', 'house', 'room'])
    .withMessage('Tipo de alojamiento no válido'),
  body('pricePerNight')
    .isFloat({ min: 1 })
    .withMessage('El precio debe ser mayor a 0'),
  body('location').trim().notEmpty().withMessage('La ubicación es obligatoria'),
  body('city').trim().notEmpty().withMessage('La ciudad es obligatoria'),
  body('country').trim().notEmpty().withMessage('El país es obligatorio'),
  body('maxGuests')
    .isInt({ min: 1 })
    .withMessage('Debe haber al menos 1 huésped'),
  handleValidation,
];

// Validaciones de reserva
const bookingValidation = [
  body('checkIn').isDate().withMessage('Fecha de entrada no válida'),
  body('checkOut').isDate().withMessage('Fecha de salida no válida'),
  body('guests').isInt({ min: 1 }).withMessage('Debe haber al menos 1 huésped'),
  handleValidation,
];

// Validaciones de reseña
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La valoración debe ser entre 1 y 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('El comentario no puede superar 1000 caracteres'),
  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  listingValidation,
  bookingValidation,
  reviewValidation,
};
