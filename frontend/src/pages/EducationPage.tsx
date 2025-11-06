import React, { useState } from 'react';
import AIChatWidget from '../components/AIChatWidget';

interface ArticleCardProps {
  category: string;
  title: string;
  summary: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ category, title, summary }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{category}</span>
    <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3">{title}</h3>
    <p className="text-slate-700 text-sm">{summary}</p>
    <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">Leer Más →</button>
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
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in relative">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Centro de Educación Financiera</h1>

      {/* Filtros */}
      <div className="mb-8 flex space-x-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
        >Todos</button>
        <button 
          onClick={() => setFilter('básico')}
          className={`px-4 py-2 rounded-lg font-semibold ${filter === 'básico' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
        >Básico</button>
        <button 
          onClick={() => setFilter('intermedio')}
          className={`px-4 py-2 rounded-lg font-semibold ${filter === 'intermedio' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
        >Intermedio</button>
        <button 
          onClick={() => setFilter('avanzado')}
          className={`px-4 py-2 rounded-lg font-semibold ${filter === 'avanzado' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
        >Avanzado</button>
      </div>

      {/* Grid de Artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <ArticleCard key={index} {...article} />
        ))}
      </div>

      {/* Floating AI Chat Widget Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Abrir chat con IA"
      >
        <span className="text-2xl">🤖</span>
      </button>

      <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default EducationPage;
