import React, { useState } from 'react';
import AIChatWidget from '../components/AIChatWidget';

interface ArticleCardProps {
  category: string;
  title: string;
  summary: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ category, title, summary }) => (
  <div className="bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-900/30 hover:transform hover:scale-105 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3">
      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-teal-400 bg-teal-900/40 rounded-full uppercase tracking-wide">
        <i className="fas fa-graduation-cap"></i>
        {category}
      </span>
      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-teal-600 transition-colors">
        <i className="fas fa-book-reader text-gray-400 group-hover:text-white"></i>
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mt-4 mb-3 leading-tight group-hover:text-teal-300 transition-colors">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed mb-6">{summary}</p>
    <button className="text-teal-400 hover:text-teal-300 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:translate-x-1">
      Leer Más <i className="fas fa-arrow-right"></i>
    </button>
  </div>
);

const EducationPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const articles = [
    {
      category: 'Básico',
      title: '¿Qué son las Acciones y Cómo Funcionan?',
      summary: 'Una guía para principiantes sobre el mundo de las acciones, su compra, venta y el potencial de ganancias.',
      tags: ['acciones', 'básico', 'mercado']
    },
    {
      category: 'Intermedio',
      title: 'Entendiendo los Bonos: Renta Fija para tu Portafolio',
      summary: 'Explora los diferentes tipos de bonos, sus riesgos y cómo pueden estabilizar tus inversiones.',
      tags: ['bonos', 'renta fija', 'intermedio']
    },
    {
      category: 'Avanzado',
      title: 'ETFs vs. Fondos Mutuos: ¿Cuál es Mejor para Ti?',
      summary: 'Compara las características, ventajas y desventajas de los ETFs y los fondos mutuos para tomar decisiones informadas.',
      tags: ['etf', 'fondos mutuos', 'avanzado']
    },
    {
      category: 'Estrategias',
      title: 'La Importancia de la Diversificación en tu Inversión',
      summary: 'Descubre por qué no debes poner todos tus huevos en la misma canasta y cómo diversificar eficazmente.',
      tags: ['diversificación', 'estrategia']
    },
    {
      category: 'Economía',
      title: 'Inflación y su Impacto en tus Ahorros',
      summary: 'Aprende qué es la inflación, cómo afecta tu poder adquisitivo y estrategias para proteger tus inversiones.',
      tags: ['inflación', 'economía']
    },
  ];

  const filteredArticles = articles.filter(article => 
    filter === 'all' ? true : article.tags.includes(filter)
  );

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-graduation-cap text-[200px] text-teal-500"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-book-open mr-4"></i>Centro Educativo
          </h1>
          <p className="text-gray-300 text-xl relative z-10 mb-6">
            Aprende sobre inversión inteligente con recursos curados por IA
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
              <i className="fas fa-book text-teal-400"></i>
              {filteredArticles.length} Artículos
            </span>
            <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
              <i className="fas fa-certificate text-amber-400"></i>
              Certificación disponible
            </span>
            <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
              <i className="fas fa-star text-cyan-400"></i>
              Calidad premium
            </span>
          </div>
        </div>

        {/* Filtros como pills con iconos mejorados */}
        <div className="mb-12 bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            <i className="fas fa-filter mr-2"></i>Filtrar por nivel
          </h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-th mr-2"></i>Todos
            </button>
            <button 
              onClick={() => setFilter('básico')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'básico' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-seedling mr-2"></i>Básico
            </button>
            <button 
              onClick={() => setFilter('intermedio')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'intermedio' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-layer-group mr-2"></i>Intermedio
            </button>
            <button 
              onClick={() => setFilter('avanzado')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'avanzado' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-rocket mr-2"></i>Avanzado
            </button>
            <button 
              onClick={() => setFilter('estrategia')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'estrategia' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-chess mr-2"></i>Estrategias
            </button>
            <button 
              onClick={() => setFilter('economía')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'economía' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>Economía
            </button>
          </div>
        </div>

        {/* Grid de Artículos */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fas fa-search text-6xl text-gray-600 mb-4"></i>
            <p className="text-xl text-gray-400">No se encontraron artículos para este filtro</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-teal-500 transition-all">
            <i className="fas fa-users text-4xl text-teal-400 mb-3"></i>
            <h3 className="text-3xl font-bold text-white mb-2">10,000+</h3>
            <p className="text-gray-400">Estudiantes activos</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-amber-500 transition-all">
            <i className="fas fa-trophy text-4xl text-amber-400 mb-3"></i>
            <h3 className="text-3xl font-bold text-white mb-2">98%</h3>
            <p className="text-gray-400">Tasa de satisfacción</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-cyan-500 transition-all">
            <i className="fas fa-clock text-4xl text-cyan-400 mb-3"></i>
            <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
            <p className="text-gray-400">Acceso ilimitado</p>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Widget Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 rounded-full shadow-2xl hover:shadow-teal-900/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50 z-50"
        aria-label="Abrir chat con IA"
      >
        <i className="fas fa-robot text-3xl"></i>
      </button>

      <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default EducationPage;
