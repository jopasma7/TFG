const router = require('express').Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadSingle, uploadMultiple, deleteImage } = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Subir una imagen (listings o avatars)
router.post('/:type', upload.single('image'), uploadSingle);

// Subir varias imágenes (hasta 10)
router.post('/:type/multiple', upload.array('images', 10), uploadMultiple);

// Eliminar una imagen
router.delete('/:type/:filename', deleteImage);

module.exports = router;
