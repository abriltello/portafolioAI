import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/api';

interface NewsItem {
  source: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  category?: string;
  author?: string;
  imageUrl?: string;
}

interface NewsItemProps {
  news: NewsItem;
}

const NewsItemCard: React.FC<NewsItemProps> = ({ news }) => {
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
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${getSourceColor(news.source)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <i className={`fas ${getSourceIcon(news.source)} text-white text-xl`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{news.source}</span>
            <span className="text-xs text-gray-400">
              <i className="fas fa-clock mr-1"></i>
              {new Date(news.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-teal-300 transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{news.summary}</p>
          <a 
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Click en enlace:', news.url);
            }}
            className="text-teal-400 hover:text-teal-300 text-sm font-bold inline-flex items-center gap-2 hover:gap-3 transition-all cursor-pointer z-10 relative"
          >
            Leer más <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Noticias de ejemplo con URLs reales de Google News
  const mockNews: NewsItem[] = [
    // Economía
    {
      source: 'El Financiero',
      title: 'La Fed mantiene tasas de interés estables en medio de señales económicas mixtas',
      summary: 'El Comité Federal de Mercado Abierto decidió mantener las tasas de interés sin cambios, señalando preocupaciones sobre la inflación persistente.',
      date: new Date().toISOString(),
      url: 'https://www.bloomberg.com/markets/rates-bonds',
      category: 'Economía',
      author: 'María González'
    },
    {
      source: 'Bloomberg Línea',
      title: 'Dólar alcanza nuevo máximo frente al peso mexicano',
      summary: 'La moneda estadounidense se fortalece ante la incertidumbre económica global y las políticas monetarias restrictivas.',
      date: new Date(Date.now() - 43200000).toISOString(),
      url: 'https://www.investing.com/currencies/usd-mxn',
      category: 'Economía',
      author: 'Pedro Ramírez'
    },
    {
      source: 'El Economista',
      title: 'Inflación en México muestra signos de desaceleración',
      summary: 'Los últimos datos del INEGI revelan una tendencia a la baja en los precios al consumidor durante el último trimestre.',
      date: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://www.reuters.com/world/americas/',
      category: 'Economía',
      author: 'Laura Méndez'
    },
    // Mercados
    {
      source: 'Investing.com',
      title: 'Wall Street cierra con ganancias impulsado por sector tecnológico',
      summary: 'Los principales índices estadounidenses registran alzas significativas ante resultados corporativos positivos.',
      date: new Date(Date.now() - 7200000).toISOString(),
      url: 'https://www.cnbc.com/world/?region=world',
      category: 'Mercados',
      author: 'Ricardo Torres'
    },
    {
      source: 'MarketWatch',
      title: 'Oro alcanza precio récord en mercado internacional',
      summary: 'El metal precioso supera los $2,100 dólares la onza ante la búsqueda de activos refugio por parte de inversionistas.',
      date: new Date(Date.now() - 129600000).toISOString(),
      url: 'https://www.investing.com/commodities/gold',
      category: 'Mercados',
      author: 'Sofía Hernández'
    },
    {
      source: 'Financial Times',
      title: 'Petróleo WTI sube por tensiones en Medio Oriente',
      summary: 'El barril de crudo texano alcanza los $85 dólares ante preocupaciones sobre la oferta energética global.',
      date: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://www.bloomberg.com/energy',
      category: 'Mercados',
      author: 'Miguel Ángel Cruz'
    },
    // Tecnología
    {
      source: 'TechCrunch',
      title: 'Apple anuncia nuevo iPhone con capacidades de IA revolucionarias',
      summary: 'La compañía tecnológica presenta su última innovación que integra inteligencia artificial avanzada directamente en el dispositivo.',
      date: new Date(Date.now() - 21600000).toISOString(),
      url: 'https://techcrunch.com/category/artificial-intelligence/',
      category: 'Tecnología',
      author: 'Carlos Rodríguez'
    },
    {
      source: 'The Verge',
      title: 'Google lanza nueva actualización de Gemini AI para competir con ChatGPT',
      summary: 'El gigante tecnológico mejora sus capacidades de inteligencia artificial con procesamiento más rápido y respuestas más precisas.',
      date: new Date(Date.now() - 108000000).toISOString(),
      url: 'https://www.theverge.com/ai-artificial-intelligence',
      category: 'Tecnología',
      author: 'Andrea López'
    },
    {
      source: 'Wired',
      title: 'Meta presenta nuevas gafas de realidad aumentada para 2025',
      summary: 'Mark Zuckerberg revela el prototipo de dispositivos AR que prometen revolucionar la forma en que interactuamos con el mundo digital.',
      date: new Date(Date.now() - 259200000).toISOString(),
      url: 'https://www.wired.com/tag/virtual-reality/',
      category: 'Tecnología',
      author: 'Fernando Jiménez'
    },
    // Empresas
    {
      source: 'CNBC',
      title: 'Tesla reporta ganancias récord impulsadas por ventas de Model Y',
      summary: 'El fabricante de vehículos eléctricos supera las expectativas de Wall Street con un incremento del 25% en entregas trimestrales.',
      date: new Date(Date.now() - 50400000).toISOString(),
      url: 'https://www.reuters.com/business/autos-transportation/',
      category: 'Empresas',
      author: 'Roberto Sánchez'
    },
    {
      source: 'Forbes',
      title: 'Amazon expande operaciones en América Latina con nuevos centros',
      summary: 'El gigante del comercio electrónico anuncia inversión de $2 mil millones para infraestructura logística en la región.',
      date: new Date(Date.now() - 302400000).toISOString(),
      url: 'https://www.reuters.com/technology/',
      category: 'Empresas',
      author: 'Patricia Vega'
    },
    {
      source: 'Business Insider',
      title: 'Microsoft supera a Apple como la empresa más valiosa del mundo',
      summary: 'La capitalización de mercado de Microsoft alcanza los $3.2 billones impulsada por el crecimiento en servicios de nube e IA.',
      date: new Date(Date.now() - 388800000).toISOString(),
      url: 'https://www.bloomberg.com/technology',
      category: 'Empresas',
      author: 'Javier Morales'
    }
  ];

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetchNews();
        // Si la API devuelve datos CON URLs, usarlos; sino usar mock data
        if (response.data && response.data.length > 0 && response.data[0].url) {
          setNews(response.data);
        } else {
          setNews(mockNews);
        }
      } catch (err) {
        // En caso de error, usar mock data
        console.log("Usando noticias de ejemplo", err);
        setNews(mockNews);
      } finally {
        setLoading(false);
      }
    };
    getNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-th mr-2"></i>Todas
            </button>
            <button 
              onClick={() => setFilter('Mercados')}
              className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                filter === 'Mercados' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>Mercados
            </button>
            <button 
              onClick={() => setFilter('Empresas')}
              className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                filter === 'Empresas' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-building mr-2"></i>Empresas
            </button>
            <button 
              onClick={() => setFilter('Economía')}
              className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                filter === 'Economía' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-landmark mr-2"></i>Economía
            </button>
            <button 
              onClick={() => setFilter('Tecnología')}
              className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                filter === 'Tecnología' 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-600 border-2 border-gray-600 hover:border-teal-500'
              }`}
            >
              <i className="fas fa-microchip mr-2"></i>Tecnología
            </button>
          </div>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {news.filter(item => filter === 'all' || item.category === filter).length > 0 ? (
            news.filter(item => filter === 'all' || item.category === filter).map((item, index) => (
              <NewsItemCard 
                key={index} 
                news={item}
              />
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
