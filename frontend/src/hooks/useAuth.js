import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// ============================================================
// useAuth - Hook para acceder al contexto de autenticación
// ============================================================
// Separado en su propio archivo para evitar el warning de
// Vite Fast Refresh (un archivo solo debe exportar componentes
// O solo funciones/hooks, no ambos).
//
// Uso: const { user, login, logout } = useAuth();
// ============================================================

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;
