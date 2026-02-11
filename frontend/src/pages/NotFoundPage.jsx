import { Link } from 'react-router-dom';

// ============================================================
// NotFoundPage - Página 404
// ============================================================

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-6">La página que buscas no existe o ha sido movida.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
