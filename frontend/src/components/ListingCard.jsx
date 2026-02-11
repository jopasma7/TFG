import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';

// ============================================================
// ListingCard - Tarjeta de alojamiento (reutilizable)
// ============================================================
// Se usa en la página principal para mostrar cada alojamiento
// en formato grid (como hace Airbnb).
//
// Props:
//   - listing: objeto con la info del alojamiento
// ============================================================

const ListingCard = ({ listing }) => {
  // Imagen por defecto si no tiene imágenes subidas
  const imageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';

  // Mapeo de tipo a etiqueta legible
  const typeLabels = {
    apartment: 'Apartamento',
    house: 'Casa',
    room: 'Habitación',
  };

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300"
    >
      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge de tipo */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
          {typeLabels[listing.type] || listing.type}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Ubicación + Rating */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.city}, {listing.country}</span>
          </div>
          {listing.averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{Number(listing.averageRating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {listing.title}
        </h3>

        {/* Capacidad */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <Users className="w-3 h-3" />
          <span>{listing.maxGuests} huéspedes · {listing.bedrooms} hab. · {listing.bathrooms} baños</span>
        </div>

        {/* Precio */}
        <p className="text-gray-900">
          <span className="font-bold text-lg">{listing.pricePerNight}€</span>
          <span className="text-gray-500 text-sm"> / noche</span>
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;
