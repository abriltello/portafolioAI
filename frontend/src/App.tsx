import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import RiskProfileForm from './components/RiskProfileForm';
import { getAuthToken, removeAuthToken } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<any>(null); // Aquí se almacenará el portafolio del usuario
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Aquí podrías cargar el portafolio del usuario si ya está autenticado
    // y si no lo tienes en el estado.
    if (isAuthenticated && !portfolio) {
      // fetchPortfolio(); // Implementar esta función para cargar el portafolio
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    // Aquí podrías también cargar el portafolio después de un login exitoso
    // fetchPortfolio();
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setPortfolio(null);
    // Redirigir a la página de inicio o login
  };

  const handlePortfolioGenerated = (newPortfolio: any) => {
    setPortfolio(newPortfolio);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-montserrat text-slate-600">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              portfolio ? (
                <Dashboard onLogout={handleLogout} portfolio={portfolio} />
              ) : (
                <RiskProfileForm onPortfolioGenerated={handlePortfolioGenerated} />
              )
            ) : (
              <Home onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            )
          } />
          {/* Rutas protegidas que requieren autenticación */}
          <Route
            path="/dashboard/*"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} portfolio={portfolio} /> : <Navigate to="/" />}
          />
          {/* Otras rutas públicas o de error */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
