import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// --- Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingDetailPage from './pages/ListingDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import CreateListingPage from './pages/CreateListingPage';
import MyListingsPage from './pages/MyListingsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// ============================================================
// App.jsx - Definición de rutas
// ============================================================
// Todas las páginas se renderizan dentro de MainLayout
// (que incluye Navbar + Footer).
//
// Rutas protegidas:
//   - /profile, /my-bookings → requieren autenticación
//   - /create-listing, /my-listings → requieren rol host/admin
// ============================================================

function App() {
  return (
    <Routes>
      {/* Layout principal con Navbar y Footer */}
      <Route element={<MainLayout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />

        {/* Rutas protegidas (requieren login) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        } />

        {/* Rutas solo para hosts/admin */}
        <Route path="/create-listing" element={
          <ProtectedRoute roles={['host', 'admin']}>
            <CreateListingPage />
          </ProtectedRoute>
        } />
        <Route path="/my-listings" element={
          <ProtectedRoute roles={['host', 'admin']}>
            <MyListingsPage />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
