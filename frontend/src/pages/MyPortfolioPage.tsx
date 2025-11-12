import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MyPortfolioPageProps {
  portfolio: any;
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

  if (!portfolio) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white">Cargando Mi Portafolio...</h2>
        <p className="text-gray-400 mt-2">Por favor, espera mientras cargamos los detalles de tu portafolio.</p>
      </div>
    );
  }

  const { assets } = portfolio;

  return (
    <div className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      {/* Título con icono */}
      <div className="flex items-center gap-3 mb-8">
        <i className="fas fa-wallet text-teal-400 text-3xl"></i>
        <h1 className="text-3xl font-bold text-white">Mi Portafolio</h1>
      </div>

      {/* Gráfico de Rendimiento */}
      <div className="mb-8 bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
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
                const mockPrice = (Math.random() * 1000 + 100).toFixed(2);
                const mockPL = (Math.random() * 1000 - 300).toFixed(2);
                const isProfit = parseFloat(mockPL) > 0;
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-400">
                      {asset.ticker}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                      {asset.allocation_pct.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      $ {mockPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <span className={`flex items-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        <i className={`fas ${isProfit ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                        {isProfit ? '+' : ''}{mockPL}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolioPage;
