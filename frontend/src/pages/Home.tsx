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
}

const Home: React.FC<HomeProps> = ({ onOpenAuthModalLogin, onOpenAuthModalRegister, onOpenAuthModalForQuestionnaire, isAuthenticated, portfolio, isLoading }) => {
  const navigate = useNavigate();

  // Función para manejar el clic en el botón principal
  const handleMainButtonClick = () => {
    if (isAuthenticated) {
      // Si está autenticado y tiene portafolio, ir al dashboard
      if (portfolio) {
        navigate('/dashboard');
      } else {
        // Si está autenticado pero no tiene portafolio, ir al cuestionario
        navigate('/risk-profile-form');
      }
    } else {
      // Si no está autenticado, abrir modal para registrarse/login antes de ir al cuestionario
      onOpenAuthModalForQuestionnaire();
    }
  };

  // Función para obtener el texto del botón según el estado
  const getButtonText = () => {
    if (isLoading) {
      return "Cargando...";
    }
    if (isAuthenticated) {
      return portfolio ? "Ir a mi Dashboard" : "Completar Cuestionario";
    }
    return "Crear mi Portafolio Gratis";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">PortafolioAI</div>
        <nav className="flex gap-3">
          <button
            onClick={onOpenAuthModalLogin}
            className="bg-white text-blue-600 border border-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onOpenAuthModalRegister}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Registrarse
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
        <div className="text-center max-w-3xl animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">Tu Asesor Financiero Personal con IA</h1>
          <p className="text-xl mb-8">
            Descubre el poder de la inteligencia artificial para optimizar tus inversiones.
            Crea un portafolio a tu medida y alcanza tus metas financieras.
          </p>
          <button
            onClick={handleMainButtonClick}
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
            disabled={isLoading} // Disable button while loading
          >
            {getButtonText()}
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
