import api from './api';

// ============================================================
// Servicio de Autenticación
// ============================================================
// Agrupa todas las llamadas a la API relacionadas con auth.
// Así los componentes no necesitan saber las URLs ni la lógica HTTP.
// ============================================================

const authService = {
  // Registrar nuevo usuario
  register: (userData) => api.post('/auth/register', userData),

  // Iniciar sesión → devuelve { token, user }
  login: (credentials) => api.post('/auth/login', credentials),

  // Obtener perfil del usuario autenticado
  getProfile: () => api.get('/auth/profile'),

  // Actualizar perfil
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default authService;
