import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RecommendationsPageProps {
  portfolio: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Cargando Recomendaciones...</h2>
        <p className="text-slate-600 mt-2">Por favor, espera mientras preparamos tus recomendaciones.</p>
      </div>
    );
  }

  const { assets, metrics } = portfolio;

  const pieChartData = assets.map((asset: any) => ({
    name: asset.name,
    value: asset.allocation_pct,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Tus Recomendaciones de Portafolio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen Textual y Métricas */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Resumen de la Estrategia</h2>
          <p className="text-slate-600 mb-4">
            Aquí tienes un resumen detallado de tu portafolio de inversión, diseñado para alinearse con tus objetivos y tolerancia al riesgo.
            Este portafolio busca un equilibrio entre el crecimiento y la estabilidad, con una diversificación estratégica en diferentes clases de activos.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Métricas Clave del Portafolio</h3>
            <p className="text-slate-700">Retorno Esperado Anual: <span className="font-bold">{(metrics.expected_return * 100).toFixed(2)}%</span></p>
            <p className="text-slate-700">Riesgo (Volatilidad): <span className="font-bold">{(metrics.risk * 100).toFixed(2)}%</span></p>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-3">Activos Recomendados</h3>
          <ul className="space-y-4">
            {assets.map((asset: any, index: number) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-slate-900">{asset.name} ({asset.ticker}) - {asset.allocation_pct.toFixed(2)}%</h4>
                <p className="text-slate-700 text-sm mt-1">Razón: {asset.reason}</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">Añadir a Simulador</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Gráfico de Distribución de Activos */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Distribución de Activos</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
