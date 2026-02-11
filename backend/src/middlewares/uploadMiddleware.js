const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Crear carpetas si no existen
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar carpeta según el tipo (listings o avatars)
    const type = req.params.type || 'listings';
    const uploadPath = path.join(__dirname, '../../uploads', type);
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nombre único: uuid + extensión original
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP)'), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por imagen
  },
});

module.exports = upload;
