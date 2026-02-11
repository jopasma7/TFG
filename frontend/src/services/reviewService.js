import api from './api';

// ============================================================
// Servicio de Reseñas (Reviews)
// ============================================================

const reviewService = {
  // Obtener reseñas de un alojamiento
  getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),

  // Crear reseña para un alojamiento
  create: (data) => api.post('/reviews', data),

  // Eliminar reseña
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
