import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import { User, Mail, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// ProfilePage - Perfil del usuario
// ============================================================

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.data);
      toast.success('Perfil actualizado');
      setEditing(false);
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    guest: 'Huésped',
    host: 'Anfitrión',
    admin: 'Administrador',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Avatar + Info básica */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              {roleLabels[user?.role] || user?.role}
            </span>
          </div>
        </div>

        {editing ? (
          /* === Modo edición === */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Cuéntanos algo sobre ti..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          /* === Modo visualización === */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-gray-900">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Biografía</p>
                <p className="text-gray-900">{user?.bio || 'Sin biografía'}</p>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
