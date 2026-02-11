import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// ============================================================
// AuthContext - Estado global de autenticación
// ============================================================
// Proporciona a toda la app:
//   - user: datos del usuario logueado (o null)
//   - token: JWT almacenado
//   - login(): iniciar sesión
//   - register(): crear cuenta
//   - logout(): cerrar sesión
//   - loading: true mientras comprobamos si hay sesión guardada
//
// El hook useAuth() está en hooks/useAuth.js (separado para
// evitar el warning de Vite Fast Refresh).
// ============================================================

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Al montar el componente, si hay token guardado,
  // verificamos que sigue siendo válido pidiendo el perfil
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data.data);
        } catch (error) {
          // Token inválido o expirado → limpiamos
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // --- Registro de nueva cuenta ---
  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // --- Inicio de sesión ---
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // --- Cerrar sesión ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // --- Actualizar datos del usuario en el estado ---
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // El value es lo que estará disponible en toda la app
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
