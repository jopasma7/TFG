import { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// ============================================================
// MyBookingsPage - Mis reservas
// ============================================================

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' o 'host'

  const isHost = user?.role === 'host' || user?.role === 'admin';

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [myRes, ...hostRes] = await Promise.all([
        bookingService.getMyBookings(),
        ...(isHost ? [bookingService.getHostBookings()] : []),
      ]);
      setMyBookings(myRes.data.data);
      if (hostRes.length > 0) setHostBookings(hostRes[0].data.data);
    } catch {
      toast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [isHost]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Actualizar estado de reserva (solo para hosts)
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingService.updateStatus(bookingId, status);
      toast.success(`Reserva ${status === 'confirmed' ? 'confirmada' : status === 'cancelled' ? 'cancelada' : 'actualizada'}`);
      fetchBookings();
    } catch {
      toast.error('Error al actualizar la reserva');
    }
  };

  const statusConfig = {
    pending: { label: 'Pendiente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    confirmed: { label: 'Confirmada', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Cancelada', icon: XCircle, color: 'text-red-600 bg-red-50' },
    completed: { label: 'Completada', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
  };

  const BookingCard = ({ booking, showActions = false }) => {
    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;
    const listing = booking.listing;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Imagen */}
          <Link to={`/listings/${listing?.id}`} className="sm:w-40 sm:h-28 rounded-lg overflow-hidden shrink-0">
            <img
              src={listing?.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop'}
              alt={listing?.title}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/listings/${listing?.id}`} className="font-semibold text-gray-900 hover:text-primary transition truncate">
                {listing?.title || 'Alojamiento'}
              </Link>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {listing?.city}, {listing?.country}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(booking.checkIn).toLocaleDateString('es-ES')} → {new Date(booking.checkOut).toLocaleDateString('es-ES')}
              </span>
              <span className="font-semibold text-gray-900">{booking.totalPrice}€</span>
            </div>

            {/* Info del huésped (para hosts) */}
            {showActions && booking.guest && (
              <p className="text-sm text-gray-500 mt-2">
                Huésped: <span className="font-medium">{booking.guest.name}</span>
              </p>
            )}

            {/* Acciones del host */}
            {showActions && booking.status === 'pending' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Reservas</h1>

      {/* Tabs si es host */}
      {isHost && (
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'guest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Como huésped ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('host')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'host' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Como anfitrión ({hostBookings.length})
          </button>
        </div>
      )}

      {/* Lista de reservas */}
      {activeTab === 'guest' ? (
        myBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tienes reservas aún</p>
            <Link to="/" className="text-primary hover:underline font-medium">
              Explorar alojamientos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        )
      ) : (
        hostBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tienes reservas en tus alojamientos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hostBookings.map((b) => <BookingCard key={b.id} booking={b} showActions />)}
          </div>
        )
      )}
    </div>
  );
};

export default MyBookingsPage;
