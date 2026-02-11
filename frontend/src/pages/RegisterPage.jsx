import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// RegisterPage - Página de registro
// ============================================================

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'guest', // por defecto: huésped
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación local
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // No enviamos confirmPassword al backend
      const { confirmPassword: _, ...userData } = formData;
      await register(userData);
      toast.success('¡Cuenta creada con éxito!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary">
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold">StayBooker</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-1 text-gray-500">Únete a StayBooker y empieza a explorar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo quieres usar StayBooker?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition text-sm font-medium ${
                  formData.role === 'guest'
                    ? 'border-primary bg-red-50 text-primary'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="guest"
                  checked={formData.role === 'guest'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🏖️ Quiero viajar
              </label>
              <label
                className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition text-sm font-medium ${
                  formData.role === 'host'
                    ? 'border-primary bg-red-50 text-primary'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="host"
                  checked={formData.role === 'host'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🏠 Quiero alojar
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center mt-6 text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
