import React from 'react';
import Footer from '../components/Footer';

interface HomeProps {
  onOpenAuthModal: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenAuthModal }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">PortafolioAI</div>
        <nav>
          <button
            onClick={onOpenAuthModal}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Iniciar Sesión / Registrarse
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
            onClick={onOpenAuthModal}
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg"
          >
            Crear mi Portafolio Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
