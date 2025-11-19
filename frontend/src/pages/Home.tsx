// Página de inicio de la aplicación
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// Props para el componente Home
interface HomeProps {
  onOpenAuthModalLogin: () => void;
  onOpenAuthModalRegister: () => void;
  onOpenAuthModalForQuestionnaire: () => void;
  isAuthenticated: boolean;
  portfolio: any;
  isLoading: boolean;
  isAdmin?: boolean;
}

const Home: React.FC<HomeProps> = ({ onOpenAuthModalLogin, onOpenAuthModalRegister, onOpenAuthModalForQuestionnaire, isAuthenticated, portfolio, isLoading, isAdmin }) => {

  const navigate = useNavigate();


  // Solo permite registro desde el botón principal
  const handleMainButtonClick = () => {
    onOpenAuthModalRegister();
  };

  // Función para obtener el texto del botón según el estado
  const getButtonText = () => {
    if (isLoading) {
      return "Cargando...";
    }
    return "Crear mi Portafolio Gratis";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary-bg)]">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg p-4 flex justify-between items-center border-b border-gray-800">
        <div className="text-2xl font-bold text-teal-400">PortafolioAI</div>
        <nav className="flex gap-3 items-center">
          <button
            onClick={onOpenAuthModalLogin}
            className="bg-transparent text-white border border-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 hover:border-teal-500 transition duration-300"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onOpenAuthModalRegister}
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Registrarse
          </button>
          {/* Botón de admin eliminado */}
        </nav>
      </header>

      {/* Hero Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center relative overflow-hidden p-8"
      >
        {/* Fondo de circuitos animado */}
        <div className="absolute inset-0 bg-[#0a0e14]">
          {/* Gradiente base */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-[#0a0e14] to-amber-900/20"></div>
          
          {/* Grid de circuitos */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
          
          {/* Puntos de conexión animados */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-amber-400 rounded-full animate-pulse-slower shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
          
          {/* Líneas de circuito */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(20,184,166,0)" />
                <stop offset="50%" stopColor="rgba(20,184,166,0.3)" />
                <stop offset="100%" stopColor="rgba(20,184,166,0)" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(245,158,11,0)" />
                <stop offset="50%" stopColor="rgba(245,158,11,0.2)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
            </defs>
            <path d="M 100 200 L 400 200 L 400 400 L 700 400" stroke="url(#lineGrad1)" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M 800 100 L 600 300 L 300 300 L 100 600" stroke="url(#lineGrad2)" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 900 500 L 700 600 L 400 600 L 200 800" stroke="url(#lineGrad1)" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
          
          {/* Orbes de luz difusa */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="text-center max-w-3xl animate-fade-in z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Tu Asesor Financiero Personal con <span className="text-teal-400">IA</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Descubre el poder de la inteligencia artificial para optimizar tus inversiones.
            Crea un portafolio a tu medida y alcanza tus metas financieras.
          </p>
          <button
            onClick={handleMainButtonClick}
            className="bg-amber-500 text-white font-bold py-4 px-10 rounded-lg shadow-2xl hover:bg-amber-600 hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {getButtonText()}
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
