import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import listingService from '../services/listingService';
import toast from 'react-hot-toast';

// ============================================================
// CreateListingPage - Crear nuevo alojamiento
// ============================================================

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    pricePerNight: '',
    location: '',
    city: '',
    country: 'España',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
  });

  const amenityOptions = [
    { value: 'wifi', label: '📶 WiFi' },
    { value: 'parking', label: '🅿️ Parking' },
    { value: 'pool', label: '🏊 Piscina' },
    { value: 'ac', label: '❄️ Aire acondicionado' },
    { value: 'kitchen', label: '🍳 Cocina' },
    { value: 'tv', label: '📺 TV' },
    { value: 'washer', label: '🧺 Lavadora' },
    { value: 'heating', label: '🔥 Calefacción' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      };
      const response = await listingService.create(data);
      toast.success('¡Alojamiento publicado con éxito!');
      navigate(`/listings/${response.data.data.id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al publicar el alojamiento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Publicar Alojamiento</h1>
      <p className="text-gray-500 mb-8">Rellena los datos de tu propiedad para que los viajeros puedan encontrarla.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Apartamento con vistas al mar"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu alojamiento: ubicación, ambiente, qué lo hace especial..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          />
        </div>

        {/* Tipo + Precio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="room">Habitación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche (€)</label>
            <input
              name="pricePerNight"
              type="number"
              min="1"
              required
              value={formData.pricePerNight}
              onChange={handleChange}
              placeholder="75"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Calle, nº"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Madrid"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Capacidad */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes máx.</label>
            <input
              name="maxGuests"
              type="number"
              min="1"
              max="20"
              value={formData.maxGuests}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
            <input
              name="bedrooms"
              type="number"
              min="0"
              max="20"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <input
              name="bathrooms"
              type="number"
              min="0"
              max="10"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Comodidades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {amenityOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAmenity(value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                  formData.amenities.includes(value)
                    ? 'border-primary bg-red-50 text-primary'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Submit */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando...' : 'Publicar Alojamiento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
