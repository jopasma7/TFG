import api from './api';

// ============================================================
// Servicio de Subida de archivos
// ============================================================

const uploadService = {
  // Subir una imagen (devuelve la URL)
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Subir múltiples imágenes (máximo 5)
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Eliminar imagen
  delete: (filename) => api.delete(`/upload/${filename}`),
};

export default uploadService;
