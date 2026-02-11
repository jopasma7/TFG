import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================================
// LoginPage - Página de inicio de sesión
// ============================================================

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
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
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-1 text-gray-500">Accede a tu cuenta para gestionar reservas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
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
                placeholder="••••••••"
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

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Link a registro */}
        <p className="text-center mt-6 text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>

        {/* Usuarios demo */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-800 mb-2">Usuarios de prueba:</p>
          <div className="text-xs text-blue-600 space-y-1">
            <p><strong>Propietario:</strong> alex@test.com / 123456</p>
            <p><strong>Huésped:</strong> laura@test.com / 123456</p>
            <p><strong>Admin:</strong> admin@test.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
