import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RecommendationsPageProps {
  portfolio: any;
}

const COLORS = ['#14b8a6', '#f59e0b', '#2563eb', '#10b981', '#8b5cf6'];

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white">Cargando Recomendaciones...</h2>
        <p className="text-gray-400 mt-2">Por favor, espera mientras preparamos tus recomendaciones.</p>
      </div>
    );
  }

  const { assets, metrics } = portfolio;

  const pieChartData = assets.map((asset: any) => ({
    name: asset.name,
    value: asset.allocation_pct,
  }));

  return (
    <div className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      {/* Título con icono */}
      <div className="flex items-center gap-3 mb-6">
        <i className="fas fa-chart-pie text-teal-400 text-3xl"></i>
        <h1 className="text-3xl font-bold text-white">Tus Recomendaciones de Portafolio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen Textual y Métricas */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Resumen de la Estrategia</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Aquí tienes un resumen detallado de tu portafolio de inversión, diseñado para alinearse con tus objetivos y tolerancia al riesgo.
            Este portafolio busca un equilibrio entre el crecimiento y la estabilidad, con una diversificación estratégica en diferentes clases de activos.
          </p>
          
          {/* Métricas Clave */}
          <div className="bg-gray-700 p-6 rounded-lg mb-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-chart-line text-teal-400"></i>
              Métricas Clave del Portafolio
            </h3>
            <div className="space-y-3">
              <p className="text-gray-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <i className="fas fa-arrow-up text-teal-400"></i>
                  Retorno Esperado Anual:
                </span>
                <span className="font-bold text-teal-400 text-xl">{(metrics.expected_return * 100).toFixed(2)}%</span>
              </p>
              <p className="text-gray-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-amber-400"></i>
                  Riesgo (Volatilidad):
                </span>
                <span className="font-bold text-amber-400 text-xl">{(metrics.risk * 100).toFixed(2)}%</span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">Activos Recomendados</h3>
          <ul className="space-y-3">
            {assets.map((asset: any, index: number) => (
              <li key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-teal-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">{asset.name} ({asset.ticker})</h4>
                  <span className="text-teal-400 font-bold text-lg">{asset.allocation_pct.toFixed(2)}%</span>
                </div>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{asset.reason}</p>
                <button className="mt-3 text-teal-400 hover:text-teal-300 text-sm font-semibold hover:underline flex items-center gap-1">
                  <i className="fas fa-plus-circle"></i>
                  Añadir a Simulador
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Gráfico de Distribución de Activos */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Distribución de Activos</h2>
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((_entry: any, index: number) => (
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
                  formatter={(value: any) => [`${value.toFixed(2)}%`, 'Asignación']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Leyenda personalizada */}
            <div className="mt-6 space-y-2">
              {pieChartData.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-200 text-sm">{entry.name}</span>
                  </div>
                  <span className="text-white font-semibold">{entry.value.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
