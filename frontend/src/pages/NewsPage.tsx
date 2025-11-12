import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/api';

interface NewsItemProps {
  source: string;
  title: string;
  summary: string;
  date: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ source, title, summary, date }) => {
  const getSourceColor = (src: string) => {
    const hash = src.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      'from-teal-600 to-cyan-600',
      'from-amber-600 to-orange-600',
      'from-blue-600 to-indigo-600',
      'from-green-600 to-emerald-600',
      'from-purple-600 to-pink-600',
      'from-red-600 to-rose-600'
    ];
    return colors[hash % colors.length];
  };

  const getSourceIcon = (src: string) => {
    const lowerSrc = src.toLowerCase();
    if (lowerSrc.includes('bloomberg') || lowerSrc.includes('financial')) return 'fa-newspaper';
    if (lowerSrc.includes('reuters') || lowerSrc.includes('wire')) return 'fa-rss';
    if (lowerSrc.includes('wsj') || lowerSrc.includes('journal')) return 'fa-book-open';
    if (lowerSrc.includes('cnbc') || lowerSrc.includes('market')) return 'fa-chart-line';
    return 'fa-globe';
  };

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-900/20 hover:transform hover:scale-105 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${getSourceColor(source)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <i className={`fas ${getSourceIcon(source)} text-white text-xl`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{source}</span>
            <span className="text-xs text-gray-400">
              <i className="fas fa-clock mr-1"></i>
              {new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-teal-300 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{summary}</p>
          <button className="text-teal-400 hover:text-teal-300 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Leer más <i className="fas fa-external-link-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetchNews();
        setNews(response.data);
      } catch (err) {
        setError("Error al cargar las noticias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
          <p className="text-xl text-gray-300">Cargando noticias financieras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 text-white pt-20 flex items-center justify-center">
        <div className="text-center bg-gray-700 p-12 rounded-xl border border-red-500">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <p className="text-xl text-red-400 font-bold">{error}</p>
          <button className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
            <i className="fas fa-redo mr-2"></i>Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con diseño mejorado */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-newspaper text-[200px] text-teal-500"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-newspaper mr-4"></i>Noticias Financieras
          </h1>
          <p className="text-gray-300 text-xl relative z-10 mb-6">
            Las últimas actualizaciones del mercado en tiempo real
          </p>
          
          {/* Indicadores de mercado */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="bg-gray-700 px-6 py-3 rounded-full border border-gray-600">
              <span className="text-sm text-gray-400 mr-2">S&P 500:</span>
              <span className="font-bold text-green-400">
                <i className="fas fa-arrow-up mr-1"></i>+1.2%
              </span>
            </div>
            <div className="bg-gray-700 px-6 py-3 rounded-full border border-gray-600">
              <span className="text-sm text-gray-400 mr-2">NASDAQ:</span>
              <span className="font-bold text-green-400">
                <i className="fas fa-arrow-up mr-1"></i>+0.8%
              </span>
            </div>
            <div className="bg-gray-700 px-6 py-3 rounded-full border border-gray-600">
              <span className="text-sm text-gray-400 mr-2">DOW JONES:</span>
              <span className="font-bold text-red-400">
                <i className="fas fa-arrow-down mr-1"></i>-0.3%
              </span>
            </div>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="mb-12 bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-600">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            <i className="fas fa-filter mr-2"></i>Categorías
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg transform hover:scale-105 transition-all">
              <i className="fas fa-th mr-2"></i>Todas
            </button>
            <button className="px-6 py-3 rounded-full font-bold bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500 transition-all">
              <i className="fas fa-chart-line mr-2"></i>Mercados
            </button>
            <button className="px-6 py-3 rounded-full font-bold bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500 transition-all">
              <i className="fas fa-building mr-2"></i>Empresas
            </button>
            <button className="px-6 py-3 rounded-full font-bold bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500 transition-all">
              <i className="fas fa-landmark mr-2"></i>Economía
            </button>
            <button className="px-6 py-3 rounded-full font-bold bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500 transition-all">
              <i className="fas fa-microchip mr-2"></i>Tecnología
            </button>
          </div>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {news.length > 0 ? (
            news.map((item, index) => (
              <NewsItem key={item.id || index} {...item} />
            ))
          ) : (
            <div className="col-span-2 text-center py-20">
              <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
              <p className="text-xl text-gray-400">No hay noticias disponibles en este momento</p>
            </div>
          )}
        </div>

        {/* Footer con estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-teal-500 transition-all">
            <i className="fas fa-sync-alt text-3xl text-teal-400 mb-3"></i>
            <h3 className="text-2xl font-bold text-white mb-2">En vivo</h3>
            <p className="text-gray-400 text-sm">Actualizaciones continuas</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-amber-500 transition-all">
            <i className="fas fa-bolt text-3xl text-amber-400 mb-3"></i>
            <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
            <p className="text-gray-400 text-sm">Cobertura global</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-cyan-500 transition-all">
            <i className="fas fa-shield-alt text-3xl text-cyan-400 mb-3"></i>
            <h3 className="text-2xl font-bold text-white mb-2">Verificado</h3>
            <p className="text-gray-400 text-sm">Fuentes confiables</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 text-center hover:border-green-500 transition-all">
            <i className="fas fa-brain text-3xl text-green-400 mb-3"></i>
            <h3 className="text-2xl font-bold text-white mb-2">IA</h3>
            <p className="text-gray-400 text-sm">Análisis inteligente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
