import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import listingService from '../services/listingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, Edit, Trash2, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// MyListingsPage - Mis alojamientos (para hosts)
// ============================================================

const MyListingsPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      // Obtenemos todos los listings y filtramos los del usuario actual
      const response = await listingService.getAll({ limit: 100 });
      const myListings = response.data.data.filter((l) => l.hostId === user.id);
      setListings(myListings);
    } catch {
      toast.error('Error al cargar tus alojamientos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este alojamiento?')) return;
    try {
      await listingService.delete(id);
      toast.success('Alojamiento eliminado');
      setListings(listings.filter((l) => l.id !== id));
    } catch {
      toast.error('Error al eliminar el alojamiento');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Alojamientos</h1>
        <Link
          to="/create-listing"
          className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aún no has publicado ningún alojamiento</p>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar tu primer alojamiento
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Imagen */}
                <Link to={`/listings/${listing.id}`} className="sm:w-40 sm:h-28 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/listings/${listing.id}`} className="font-semibold text-gray-900 hover:text-primary transition">
                    {listing.title}
                  </Link>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="w-3 h-3" />
                    {listing.city}, {listing.country}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{listing.pricePerNight}€/noche</span>
                    {listing.averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {Number(listing.averageRating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link
                    to={`/listings/${listing.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Edit className="w-3 h-3" />
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
