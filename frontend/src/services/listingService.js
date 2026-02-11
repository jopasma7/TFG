import api from './api';

// ============================================================
// Servicio de Alojamientos (Listings)
// ============================================================
// CRUD completo + búsqueda con filtros.
// ============================================================

const listingService = {
  // Obtener todos los alojamientos (con filtros opcionales)
  // params puede incluir: city, type, minPrice, maxPrice, guests, page, limit
  getAll: (params = {}) => api.get('/listings', { params }),

  // Obtener un alojamiento por ID
  getById: (id) => api.get(`/listings/${id}`),

  // Crear nuevo alojamiento (requiere auth + rol host)
  create: (data) => api.post('/listings', data),

  // Actualizar alojamiento
  update: (id, data) => api.put(`/listings/${id}`, data),

  // Eliminar alojamiento
  delete: (id) => api.delete(`/listings/${id}`),
};

export default listingService;
