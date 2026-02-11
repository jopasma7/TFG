import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, BedDouble, Bath, Calendar, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import listingService from '../services/listingService';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// ============================================================
// ListingDetailPage - Detalle de un alojamiento
// ============================================================
// Muestra toda la info del alojamiento + formulario de reserva
// + reseñas de otros usuarios.
// ============================================================

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Formulario de reserva
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  // Formulario de reseña
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingRes, reviewsRes] = await Promise.all([
        listingService.getById(id),
        reviewService.getByListing(id),
      ]);
      setListing(listingRes.data.data);
      setReviews(reviewsRes.data.data);
    } catch {
      toast.error('Error al cargar el alojamiento');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calcular precio total
  const calculateTotal = () => {
    if (!booking.checkIn || !booking.checkOut || !listing) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * listing.pricePerNight : 0;
  };

  const nights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  // Crear reserva
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingService.create({
        listingId: parseInt(id),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: parseInt(booking.guests),
      });
      toast.success('¡Reserva creada con éxito!');
      navigate('/my-bookings');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear la reserva';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Crear reseña
  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    setReviewLoading(true);
    try {
      await reviewService.create({
        listingId: parseInt(id),
        rating: parseInt(review.rating),
        comment: review.comment,
      });
      toast.success('¡Reseña publicada!');
      setReview({ rating: 5, comment: '' });
      // Recargar reseñas y listing (para actualizar rating)
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al publicar la reseña';
      toast.error(message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!listing) return null;

  const imageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop';

  const amenityLabels = {
    wifi: '📶 WiFi',
    parking: '🅿️ Parking',
    pool: '🏊 Piscina',
    ac: '❄️ Aire acondicionado',
    kitchen: '🍳 Cocina',
    tv: '📺 TV',
    washer: '🧺 Lavadora',
    heating: '🔥 Calefacción',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Imagen principal */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-64 sm:h-80 md:h-96 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === Columna izquierda: Info del alojamiento === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título + ubicación */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {listing.location}, {listing.city}, {listing.country}
              </span>
              {listing.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {Number(listing.averageRating).toFixed(1)} ({listing.totalReviews} reseñas)
                </span>
              )}
            </div>
          </div>

          {/* Características */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            <span className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              {listing.maxGuests} huéspedes
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <BedDouble className="w-5 h-5" />
              {listing.bedrooms} habitaciones
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <Bath className="w-5 h-5" />
              {listing.bathrooms} baños
            </span>
          </div>

          {/* Anfitrión */}
          {listing.host && (
            <div className="flex items-center gap-3 py-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {listing.host.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">Anfitrión: {listing.host.name}</p>
                <p className="text-sm text-gray-500">{listing.host.bio || 'Sin biografía'}</p>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Comodidades */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Comodidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    {amenityLabels[amenity] || amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* === Reseñas === */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reseñas {reviews.length > 0 && `(${reviews.length})`}
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-400">Aún no hay reseñas para este alojamiento.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-white">
                          {rev.author?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{rev.author?.name || 'Anónimo'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario nueva reseña */}
            {isAuthenticated && (
              <form onSubmit={handleReview} className="mt-6 bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-800">Deja tu reseña</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Puntuación:</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview({ ...review, rating: e.target.value })}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Escribe tu opinión..."
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium disabled:opacity-50"
                >
                  {reviewLoading ? 'Publicando...' : 'Publicar Reseña'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* === Columna derecha: Tarjeta de reserva === */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold">{listing.pricePerNight}€</span>
              <span className="text-gray-500">/ noche</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Llegada
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Salida
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.checkOut}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Huéspedes */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Huéspedes</label>
                <select
                  value={booking.guests}
                  onChange={(e) => setBooking({ ...booking, guests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</option>
                  ))}
                </select>
              </div>

              {/* Desglose de precio */}
              {nights() > 0 && (
                <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{listing.pricePerNight}€ x {nights()} noches</span>
                    <span>{calculateTotal()}€</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                    <span>Total</span>
                    <span>{calculateTotal()}€</span>
                  </div>
                </div>
              )}

              {/* Botón reservar */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Reservando...' : 'Reservar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
