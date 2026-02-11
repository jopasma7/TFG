import axios from 'axios';

// ============================================================
// Instancia de Axios configurada para nuestra API
// ============================================================
// - baseURL: todas las peticiones irán a /api/... 
//   (Vite proxy redirige a http://localhost:3000)
// - Interceptor: añade automáticamente el token JWT a cada petición
// - Interceptor de respuesta: si el servidor devuelve 401 (no autorizado),
//   limpiamos el token y redirigimos al login
// ============================================================

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de petición ---
// Antes de cada petición, si hay token guardado en localStorage,
// lo añade como header Authorization: Bearer <token>
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor de respuesta ---
// Si el servidor devuelve 401, el token ha expirado o es inválido
// Limpiamos sesión y recargamos para ir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Solo redirigimos si no estamos ya en login/register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
