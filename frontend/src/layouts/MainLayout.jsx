import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// ============================================================
// MainLayout - Layout principal de la aplicación
// ============================================================
// Estructura:
//   ┌─────────────────┐
//   │     Navbar       │  ← Siempre visible arriba
//   ├─────────────────┤
//   │                 │
//   │   <Outlet />    │  ← Aquí se renderiza la página actual
//   │                 │
//   ├─────────────────┤
//   │     Footer       │  ← Siempre visible abajo
//   └─────────────────┘
//
// <Outlet /> es un componente de React Router que renderiza
// automáticamente el componente hijo de la ruta actual.
// ============================================================

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
