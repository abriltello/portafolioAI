// Componente principal de la aplicación
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import RiskProfileForm from './components/RiskProfileForm';
import { getAuthToken, removeAuthToken, fetchCurrentUser } from './services/api';

function App() {
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  // Estado para controlar si el modal de autenticación está abierto
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  // Estado para controlar si el modal debe abrir en modo registro
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  // Estado para almacenar el portafolio del usuario
  const [portfolio, setPortfolio] = useState<any>(null);
  // Estado para mostrar carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para errores
  const [error, setError] = useState<string | null>(null);
  // Estado para saber si debe redirigir al cuestionario después de login
  const [shouldRedirectToQuestionnaire, setShouldRedirectToQuestionnaire] = useState<boolean>(false);

  // Función para obtener el portafolio del usuario desde el backend
  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetchCurrentUser();
      if (response.data && response.data.portfolio) {
        setPortfolio(response.data.portfolio);
      } else {
        setPortfolio(null);
      }
    } catch (err) {
      console.error("Error fetching user portfolio:", err);
      setError("Failed to load portfolio.");
      setPortfolio(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Efecto para cargar el portafolio cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && !portfolio) {
      fetchPortfolio();
    }
  }, [isAuthenticated, portfolio, fetchPortfolio]);

  // Función llamada cuando la autenticación es exitosa
  const handleLoginSuccess = async (source: 'login' | 'register') => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setShouldRedirectToQuestionnaire(false);

    if (source === 'register') {
      // Registro: siempre ir al cuestionario
      window.location.href = '/risk-profile-form';
      return;
    }

    // Login: detectar si es primera vez (sin portafolio) y redirigir a cuestionario; si no, al dashboard
    try {
      const me = await fetchCurrentUser();
      const hasPortfolio = !!me.data?.portfolio;
      if (hasPortfolio) {
        window.location.href = '/dashboard/overview';
      } else {
        window.location.href = '/risk-profile-form';
      }
    } catch (err) {
      // Ante error, fallback al dashboard
      window.location.href = '/dashboard/overview';
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setPortfolio(null);
    window.location.href = '/';
  };

  // Función llamada cuando se genera un portafolio
  const handlePortfolioGenerated = (newPortfolio: any) => {
    setPortfolio(newPortfolio);
  };

  // Función para abrir el modal de autenticación y luego ir al cuestionario
  const handleOpenAuthModalForQuestionnaire = () => {
    setShouldRedirectToQuestionnaire(true);
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo login
  const handleOpenAuthModalLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo registro
  const handleOpenAuthModalRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-montserrat text-slate-600">
        <Routes>
          <Route path="/" element={
            <Home
              onOpenAuthModalLogin={handleOpenAuthModalLogin}
              onOpenAuthModalRegister={handleOpenAuthModalRegister}
              onOpenAuthModalForQuestionnaire={handleOpenAuthModalForQuestionnaire}
              isAuthenticated={isAuthenticated}
              portfolio={portfolio}
              isLoading={isLoading}
            />
          } />
          {/* Rutas protegidas que requieren autenticación */}
          <Route
            path="/dashboard/*"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} portfolio={portfolio} /> : <Navigate to="/" />}
          />
          <Route
            path="/risk-profile-form"
            element={isAuthenticated ? <RiskProfileForm onPortfolioGenerated={handlePortfolioGenerated} /> : <Navigate to="/" />}
          />
          {/* Otras rutas públicas o de error */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authModalMode}
        />
      </div>
    </Router>
  );
}

export default App;
