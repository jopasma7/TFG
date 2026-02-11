import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

// ============================================================
// main.jsx - Punto de entrada de React
// ============================================================
// Envolvemos la app con:
//   - BrowserRouter → para que funcione React Router
//   - AuthProvider → para que toda la app tenga acceso al estado de auth
//   - Toaster → para las notificaciones toast
// ============================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '14px' },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
