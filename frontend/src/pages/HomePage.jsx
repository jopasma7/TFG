import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import listingService from '../services/listingService';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';

// ============================================================
// HomePage - Página principal
// ============================================================
// Muestra un grid de alojamientos con barra de búsqueda
// y filtros (ciudad, tipo, precio, huéspedes).
// Los filtros se sincronizan con la URL (query params).
// ============================================================

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});

  // Filtros: se leen de la URL para que sean compartibles
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    guests: searchParams.get('guests') || '',
  });

  // Cargar alojamientos cuando cambian los filtros
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir params solo con valores no vacíos
      const params = {};
      searchParams.forEach((value, key) => {
        if (value) params[key] = value;
      });

      const response = await listingService.getAll(params);
      setListings(response.data.data);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError('Error al cargar los alojamientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Aplicar filtros → actualiza la URL
  const applyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    setShowFilters(false);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({ city: '', type: '', minPrice: '', maxPrice: '', guests: '' });
    setSearchParams({});
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* === Hero / Búsqueda === */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Encuentra tu alojamiento ideal
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Explora casas, apartamentos y habitaciones únicas en toda España
        </p>

        {/* Barra de búsqueda rápida */}
        <form onSubmit={applyFilters} className="max-w-xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition font-medium text-sm"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="relative px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </form>
      </div>

      {/* === Panel de Filtros === */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filtros</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={applyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Todos</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="room">Habitación</option>
              </select>
            </div>

            {/* Precio mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio mín. (€)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio máx. (€)</label>
              <input
                type="number"
                placeholder="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Huéspedes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
              <input
                type="number"
                placeholder="2"
                min="1"
                value={filters.guests}
                onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Botones */}
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Limpiar filtros
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </div>
      )}

      {/* === Grid de Alojamientos === */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No se encontraron alojamientos</p>
          <p className="text-gray-400 text-sm">Prueba con otros filtros de búsqueda</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Paginación simple */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', page);
                    setSearchParams(params);
                  }}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                    pagination.currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
