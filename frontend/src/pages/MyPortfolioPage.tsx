import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Cargando Mi Portafolio...</h2>
        <p className="text-slate-600 mt-2">Por favor, espera mientras cargamos los detalles de tu portafolio.</p>
      </div>
    );
  }

  const { assets } = portfolio;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Mi Portafolio</h1>

      {/* Gráfico de Rendimiento */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Rendimiento del Portafolio (Últimos 12 Meses)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={performanceData}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Valor del Portafolio" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Holdings */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Mis Activos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocación %</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Actual</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L (Ganancia/Pérdida)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.map((asset: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.ticker}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.allocation_pct.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$ {(Math.random() * 1000 + 100).toFixed(2)}</td> {/* Mock Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{(Math.random() * 500).toFixed(2)}</td> {/* Mock P/L */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolioPage;
