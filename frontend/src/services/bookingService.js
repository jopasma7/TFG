import api from './api';

// ============================================================
// Servicio de Reservas (Bookings)
// ============================================================

const bookingService = {
  // Mis reservas como huésped
  getMyBookings: () => api.get('/bookings'),

  // Reservas de mis alojamientos (como host)
  getHostBookings: () => api.get('/bookings/host'),

  // Crear nueva reserva
  create: (data) => api.post('/bookings', data),

  // Actualizar estado (confirmar, cancelar, completar)
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export default bookingService;
