const path = require('path');
const fs = require('fs');

// POST /api/upload/:type (una imagen)
const uploadSingle = (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No se ha proporcionado ninguna imagen.');
    }

    const type = req.params.type || 'listings';
    const imageUrl = `/uploads/${type}/${req.file.filename}`;

    res.status(201).json({
      message: 'Imagen subida correctamente',
      image: {
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/upload/:type/multiple (varias imágenes)
const uploadMultiple = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No se han proporcionado imágenes.');
    }

    const type = req.params.type || 'listings';
    const images = req.files.map((file) => ({
      url: `/uploads/${type}/${file.filename}`,
      filename: file.filename,
      size: file.size,
    }));

    res.status(201).json({
      message: `${images.length} imagen(es) subida(s) correctamente`,
      images,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/upload/:type/:filename
const deleteImage = (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Imagen no encontrada.');
    }

    fs.unlinkSync(filePath);

    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSingle, uploadMultiple, deleteImage };
