import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Home, Menu, X, User, LogOut, PlusCircle, Calendar } from 'lucide-react';

// ============================================================
// Navbar - Barra de navegación principal
// ============================================================
// - Logo a la izquierda
// - Links de navegación en el centro (desktop)
// - Botones de auth a la derecha
// - Menú hamburguesa en móvil
// ============================================================

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* === Logo === */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
            <Home className="w-7 h-7" />
            <span className="text-xl font-bold hidden sm:block">StayBooker</span>
          </Link>

          {/* === Navegación Desktop === */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Explorar
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-bookings" className="text-gray-600 hover:text-gray-900 transition font-medium">
                  Mis Reservas
                </Link>
                {(user?.role === 'host' || user?.role === 'admin') && (
                  <Link to="/my-listings" className="text-gray-600 hover:text-gray-900 transition font-medium">
                    Mis Alojamientos
                  </Link>
                )}
              </>
            )}
          </div>

          {/* === Botones Auth Desktop === */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {(user?.role === 'host' || user?.role === 'admin') && (
                  <Link
                    to="/create-listing"
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-red-50 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Publicar
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                  <User className="w-4 h-4" />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* === Botón Hamburguesa Móvil === */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* === Menú Móvil === */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <Home className="w-4 h-4" />
              Explorar
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <Calendar className="w-4 h-4" />
                  Mis Reservas
                </Link>
                {(user?.role === 'host' || user?.role === 'admin') && (
                  <>
                    <Link
                      to="/my-listings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                      Mis Alojamientos
                    </Link>
                    <Link
                      to="/create-listing"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary hover:bg-red-50 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Publicar Alojamiento
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-white bg-primary text-center hover:bg-primary-dark transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
