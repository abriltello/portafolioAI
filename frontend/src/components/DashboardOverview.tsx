
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';



const COLORS = ['#14b8a6', '#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#eab308', '#f43f5e', '#22d3ee', '#a3e635', '#8b5cf6'];



interface DashboardOverviewProps {
  portfolio: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ portfolio }) => {
  // Si no hay portafolio, muestra mensaje
  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">No tienes portafolio generado</h2>
          <p className="text-gray-300 mb-4">Haz la encuesta para generar tu portafolio personalizado.</p>
          <Link to="/risk-profile-form">
            <button className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-teal-600 transition">Ir a la encuesta</button>
          </Link>
        </div>
      </div>
    );
  }

  // Extraer métricas y activos del portafolio real
  const metrics = portfolio.metrics ?? { expected_return: 0, risk: 0 };
  const assets = portfolio.assets ?? [];
  // Selección de activos principales para Overview (top 3 por porcentaje)
  const mainAssets = [...assets]
    .sort((a, b) => (b.allocation_pct ?? 0) - (a.allocation_pct ?? 0))
    .slice(0, 3);
  const chartData = mainAssets.map(asset => ({
    name: asset.name,
    value: parseFloat((asset.allocation_pct ?? 0).toFixed(2)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 py-8 px-2 sm:px-4 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
            <i className="fas fa-chart-pie text-[180px] text-teal-500"></i>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent relative z-10 drop-shadow-lg">
            <i className="fas fa-compass mr-4"></i>Tu Portafolio Actual
          </h1>
          <p className="text-gray-300 text-base sm:text-xl relative z-10">Basado en tu perfil de riesgo, mostramos los activos más recomendados para tu inversión</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link to="/risk-profile-form">
              <button className="flex items-center gap-2 text-teal-700 font-semibold px-4 py-2 rounded-lg border border-teal-300 bg-white/80 hover:bg-teal-100 hover:border-teal-500 transition-colors duration-200 shadow cursor-pointer">
                <i className="fas fa-sync-alt text-teal-500 text-base"></i>
                Actualizar mi portafolio
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Métricas Clave */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-teal-700 p-6 sm:p-8 flex flex-col items-center animate-fade-in">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-chart-line text-teal-400"></i>
                Retorno Esperado Anual
              </h3>
              <p className="text-4xl sm:text-6xl font-bold text-teal-400 drop-shadow-xl animate-pulse">{(metrics.expected_return * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-amber-700 p-6 sm:p-8 flex flex-col items-center animate-fade-in">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-shield-alt text-amber-400"></i>
                Nivel de Riesgo
              </h3>
              <p className="text-4xl sm:text-6xl font-bold text-amber-400 drop-shadow-xl animate-pulse">{(metrics.risk * 100).toFixed(2)}%</p>
            </div>
            <div className="mt-6 sm:mt-8 text-center">
              <Link to="/dashboard/recommendations">
                <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-10 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition duration-300 shadow-lg shadow-teal-900/40 text-base sm:text-lg">
                  Ver mi Estrategia Completa
                </button>
              </Link>
            </div>
          </div>

          {/* Distribución de Activos */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8 animate-fade-in">
            <h3 className="text-lg sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <i className="fas fa-layer-group text-cyan-400"></i>
              Distribución de Activos Recomendados
            </h3>
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <div className="h-48 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 sm:space-y-4 w-full">
                {mainAssets.map((asset, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 shadow-md gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-200 text-sm sm:text-base font-medium">{asset.name}</span>
                      <span className="text-xs text-gray-400">({asset.ticker})</span>
                    </div>
                    <span className="text-white font-bold text-base sm:text-lg">{asset.allocation_pct?.toFixed(2) ?? '0.00'}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
