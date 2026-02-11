import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================
// Footer - Pie de página
// ============================================================

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Columna 1: Logo + descripción */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-primary mb-3">
              <Home className="w-6 h-6" />
              <span className="text-lg font-bold">StayBooker</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Encuentra alojamientos únicos y vive experiencias inolvidables en cualquier rincón de España.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Explorar</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-gray-800 transition">Alojamientos</Link></li>
              <li><Link to="/?city=Madrid" className="hover:text-gray-800 transition">Madrid</Link></li>
              <li><Link to="/?city=Barcelona" className="hover:text-gray-800 transition">Barcelona</Link></li>
              <li><Link to="/?city=Sevilla" className="hover:text-gray-800 transition">Sevilla</Link></li>
            </ul>
          </div>

          {/* Columna 3: Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Información</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-gray-800 transition cursor-pointer">Sobre nosotros</span></li>
              <li><span className="hover:text-gray-800 transition cursor-pointer">Ayuda</span></li>
              <li><span className="hover:text-gray-800 transition cursor-pointer">Términos y condiciones</span></li>
              <li><span className="hover:text-gray-800 transition cursor-pointer">Privacidad</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} StayBooker — Proyecto TFG</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
