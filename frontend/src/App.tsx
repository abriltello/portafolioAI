          {/* <Route path="/admin/config" element={isAuthenticated && isAdmin ? <SystemConfig /> : <Navigate to="/" />} /> */}
// import SystemConfig from './pages/Admin/SystemConfig';
// Componente principal de la aplicación
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import RiskProfileForm from './components/RiskProfileForm';
import AnimatedBackground from './components/AnimatedBackground';
import { getAuthToken, removeAuthToken, fetchCurrentUser } from './services/api';
// Importar componentes de admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import PortfolioManagement from './pages/Admin/PortfolioManagement';
import SimulationMonitor from './pages/Admin/SimulationMonitor';
import ContentManager from './pages/Admin/ContentManager';
import SupportMessages from './pages/Admin/SupportMessages';
import LogsAudit from './pages/Admin/LogsAudit';

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
  // Estado para saber si el usuario es admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Función para obtener el portafolio y rol del usuario desde el backend
  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetchCurrentUser();
      console.log('Respuesta de /auth/me:', response.data); // LOG para depuración
      if (response.data && response.data.portfolio) {
        setPortfolio(response.data.portfolio);
      } else {
        setPortfolio(null);
      }
      // Verificar si el usuario es admin (ajusta según tu backend)
      const isAdminUser = response.data?.role === 'admin';
      setIsAdmin(isAdminUser);
      console.log('Valor de isAdmin:', isAdminUser); // LOG para depuración
    } catch (err: any) {
      console.error("Error fetching user portfolio:", err);
      // Si el error es 401 (Unauthorized), limpiar el token y cerrar sesión
      if (err.response?.status === 401) {
        console.log("Token inválido o expirado. Cerrando sesión...");
        removeAuthToken();
        setIsAuthenticated(false);
        setPortfolio(null);
        setIsAdmin(false);
        return;
      }
      setPortfolio(null);
      setIsAdmin(false);
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

  const navigate = useNavigate();
  // Función llamada cuando la autenticación es exitosa
  const handleLoginSuccess = async (source: 'login' | 'register') => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    try {
      const me = await fetchCurrentUser();
      const isAdminUser = me.data?.role === 'admin';
      setIsAdmin(isAdminUser); // Actualiza el estado global
      if (isAdminUser) {
        navigate('/admin');
        return;
      }
      if (source === 'register') {
        navigate('/risk-profile-form');
        return;
      }
      const hasPortfolio = !!me.data?.portfolio;
      if (hasPortfolio) {
        navigate('/dashboard/overview');
      } else {
        navigate('/risk-profile-form');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.error("Token inválido después del login:", err);
        removeAuthToken();
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      // No redirigir a '/'
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
    <div className="min-h-screen bg-[var(--color-primary-bg)] font-montserrat text-[var(--color-text-light)]">
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={
          <Home
            onOpenAuthModalLogin={handleOpenAuthModalLogin}
            onOpenAuthModalRegister={handleOpenAuthModalRegister}
            onOpenAuthModalForQuestionnaire={handleOpenAuthModalForQuestionnaire}
            isAuthenticated={isAuthenticated}
            portfolio={portfolio}
            isLoading={isLoading}
            isAdmin={isAdmin}
          />
        } />
        {/* Rutas protegidas que requieren autenticación */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} portfolio={portfolio} isAdmin={isAdmin} /> : null}
        />
        <Route
          path="/risk-profile-form"
          element={isAuthenticated ? <RiskProfileForm onPortfolioGenerated={handlePortfolioGenerated} /> : null}
        />
        {/* Rutas de administración, solo para admin */}
        <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard onLogout={handleLogout} /> : null} />
        <Route path="/admin/users" element={isAuthenticated && isAdmin ? <UserManagement /> : null} />
        <Route path="/admin/portfolios" element={isAuthenticated && isAdmin ? <PortfolioManagement /> : null} />
        <Route path="/admin/simulations" element={isAuthenticated && isAdmin ? <SimulationMonitor /> : null} />
        <Route path="/admin/content" element={isAuthenticated && isAdmin ? <ContentManager /> : null} />
        <Route path="/admin/support" element={isAuthenticated && isAdmin ? <SupportMessages /> : null} />
        <Route path="/admin/logs" element={isAuthenticated && isAdmin ? <LogsAudit /> : null} />
        {/* Otras rutas públicas o de error */}
        <Route path="*" element={null} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;
