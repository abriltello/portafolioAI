import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockData } from '../services/api';

interface MyPortfolioPageProps {
  portfolio: any;
}

interface StockData {
  ticker: string;
  name: string;
  current_price: number;
  previous_close: number;
  price_change: number;
  price_change_percent: number;
  currency: string;
  error?: string;
}

// Función mock para generar datos de rendimiento
const generatePerformanceData = () => {
  const data = [];
  let value = 10000; // Valor inicial del portafolio
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    value += Math.random() * 500 - 200; // Simula fluctuaciones
    data.push({
      name: date.toLocaleString('es-ES', { month: 'short', year: '2-digit' }),
      'Valor del Portafolio': Math.round(value),
    });
  }
  return data;
};

const MyPortfolioPage: React.FC<MyPortfolioPageProps> = ({ portfolio }) => {
  const performanceData = generatePerformanceData();
  const [stocksData, setStocksData] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de Yahoo Finance cuando cambie el portfolio
  useEffect(() => {
    if (portfolio && portfolio.assets && portfolio.assets.length > 0) {
      loadStockData();
    }
  }, [portfolio]);

  const loadStockData = async () => {
    if (!portfolio?.assets) return;

    setLoading(true);
    setError(null);

    try {
      const tickers = portfolio.assets.map((asset: any) => asset.ticker);
      const response = await fetchStockData(tickers);
      
      // Crear un mapa de ticker -> datos
      const dataMap: Record<string, StockData> = {};
      response.data.stocks.forEach((stock: StockData) => {
        dataMap[stock.ticker] = stock;
      });
      
      setStocksData(dataMap);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Error al cargar datos de mercado. Mostrando información básica.');
    } finally {
      setLoading(false);
    }
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center bg-gray-700 p-12 rounded-xl shadow-2xl border border-gray-600">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Cargando Mi Portafolio...</h2>
          <p className="text-gray-400">Por favor, espera mientras cargamos los detalles de tu portafolio.</p>
        </div>
      </div>
    );
  }

  const { assets } = portfolio;

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-2xl">
              <i className="fas fa-wallet text-white text-3xl"></i>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Mi Portafolio
              </h1>
              <p className="text-gray-400 text-sm mt-1">Gestiona y monitorea tus inversiones</p>
            </div>
          </div>
          
          {/* Botón de actualización */}
          <button
            onClick={loadStockData}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg border border-gray-600 hover:border-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-amber-900/30 border border-amber-500/50 rounded-xl p-4 flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-amber-400 text-xl"></i>
            <p className="text-amber-300 text-sm">{error}</p>
          </div>
        )}

        {/* Gráfico de Rendimiento */}
        <div className="mb-8 bg-gray-700 p-8 rounded-xl border border-gray-600 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fas fa-chart-line text-teal-400"></i>
            Rendimiento del Portafolio (Últimos 12 Meses)
          </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={performanceData}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#e5e7eb'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="Valor del Portafolio" 
              stroke="#14b8a6" 
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Holdings */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-list text-teal-400"></i>
          Mis Activos
        </h2>
        <div className="overflow-x-auto bg-gray-700 rounded-lg border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <i className="fas fa-tag mr-2"></i>Ticker
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <i className="fas fa-building mr-2"></i>Nombre
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <i className="fas fa-percentage mr-2"></i>Allocación
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <i className="fas fa-dollar-sign mr-2"></i>Precio Actual
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <i className="fas fa-chart-bar mr-2"></i>P/L
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {assets.map((asset: any, index: number) => {
                const stockData = stocksData[asset.ticker];
                const realName = stockData?.name || asset.name;
                const currentPrice = stockData?.current_price || 0;
                const priceChange = stockData?.price_change || 0;
                const priceChangePercent = stockData?.price_change_percent || 0;
                const isProfit = priceChange >= 0;
                const hasError = stockData?.error;
                
                return (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                          {asset.ticker.substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-teal-400">{asset.ticker}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      <div className="flex flex-col">
                        <span className="font-semibold">{realName}</span>
                        {loading && <span className="text-xs text-gray-500">Cargando...</span>}
                        {hasError && <span className="text-xs text-red-400">Error al cargar</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-600 rounded-full h-2 max-w-[80px]">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(asset.allocation_pct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold">{asset.allocation_pct.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {currentPrice > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-white font-bold">${currentPrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-400">{stockData?.currency || 'USD'}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      {currentPrice > 0 ? (
                        <div className="flex flex-col items-start">
                          <span className={`flex items-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            <i className={`fas ${isProfit ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                            {isProfit ? '+' : ''}{priceChange.toFixed(2)}
                          </span>
                          <span className={`text-xs ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
                            ({isProfit ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MyPortfolioPage;
