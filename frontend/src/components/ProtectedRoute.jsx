import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// ============================================================
// ProtectedRoute - Ruta protegida
// ============================================================
// Envuelve páginas que requieren autenticación.
// Si el usuario no está logueado, redirige a /login.
// Opcionalmente filtra por roles (ej: solo 'host' o 'admin').
// ============================================================

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mientras comprobamos la sesión, mostramos spinner
  if (loading) {
    return <LoadingSpinner text="Verificando sesión..." />;
  }

  // No autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles y el usuario no tiene el adecuado
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
