import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardOverviewProps {
  portfolio: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white">Cargando Portafolio...</h2>
        <p className="text-gray-400 mt-2">Por favor, espera mientras preparamos tus recomendaciones.</p>
      </div>
    );
  }

  const { metrics, assets } = portfolio;

  // Preparar datos para el gráfico de pastel
  const chartData = assets.map((asset: any) => ({
    name: asset.name,
    value: parseFloat(asset.allocation_pct.toFixed(2)),
  }));

  // Colores para el gráfico (consistentes con la nueva paleta)
  const COLORS = ['#14b8a6', '#f59e0b', '#06b6d4', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal (Izquierda) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título y Descripción */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tu Portafolio Actual</h1>
            <p className="text-gray-400">Basado en tu perfil de riesgo, hemos diseñado el siguiente portafolio:</p>
          </div>

          {/* Métricas Clave: Retorno y Riesgo (Fila) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Retorno Esperado Anual */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Retorno Esperado Anual</h3>
              <div className="flex items-center gap-4">
                <i className="fas fa-chart-line text-gray-400 text-3xl"></i>
                <p className="text-5xl font-bold text-teal-400">
                  {(metrics.expected_return * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Nivel de Riesgo */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Nivel de Riesgo</h3>
              <div className="flex items-center gap-4">
                <i className="fas fa-shield-alt text-gray-400 text-3xl"></i>
                <p className="text-5xl font-bold text-amber-400">
                  {(metrics.risk * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Distribución de Activos (Tarjeta Grande) */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Distribución de Activos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gráfico de Pastel */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e2936', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                      formatter={(value: any) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lista de Activos con Colores */}
              <div className="space-y-3">
                {assets.map((asset: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <p className="text-gray-200 text-sm flex-1">
                      {asset.name}: <span className="font-semibold">{asset.allocation_pct.toFixed(0)}%</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botón Ver Estrategia Completa */}
          <div>
            <Link to="/dashboard/recommendations">
              <button className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition duration-300 shadow-lg">
                Ver mi Estrategia Completa
              </button>
            </Link>
          </div>
        </div>

        {/* Columna de Acciones Rápidas (Derecha) */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 h-fit">
          <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center gap-2">
              <i className="fas fa-calculator"></i>
              Simular Inversión
            </button>
            <button className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center gap-2">
              <i className="fas fa-user-edit"></i>
              Actualizar Perfil
            </button>
            <button className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center gap-2">
              <i className="fas fa-newspaper"></i>
              Ver Últimas Noticias
            </button>
            <button className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition duration-300 flex items-center justify-center gap-2">
              <i className="fas fa-headset"></i>
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
