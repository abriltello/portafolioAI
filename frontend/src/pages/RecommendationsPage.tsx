import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RecommendationsPageProps {
  portfolio: any;
}

const COLORS = ['#14b8a6', '#f59e0b', '#2563eb', '#10b981', '#8b5cf6'];

// Mapeo de niveles de riesgo a descripciones de perfil
const INVESTOR_PROFILES: Record<string, { name: string; description: string; color: string; icon: string }> = {
  low: {
    name: 'Conservador',
    description: 'El inversor conservador prioriza la preservación del capital y busca inversiones de bajo riesgo con retornos estables y predecibles. Prefiere bonos gubernamentales, fondos de renta fija y empresas establecidas con dividendos consistentes. Su objetivo principal es proteger su patrimonio de la volatilidad del mercado.',
    color: 'blue',
    icon: 'fa-shield-alt'
  },
  medium: {
    name: 'Moderado',
    description: 'El inversor moderado busca un equilibrio entre crecimiento y estabilidad. Está dispuesto a asumir cierto nivel de riesgo para obtener mejores retornos, pero mantiene una porción significativa en activos seguros. Su portafolio combina acciones de empresas sólidas con bonos y fondos diversificados, buscando crecimiento sostenible a mediano plazo.',
    color: 'teal',
    icon: 'fa-balance-scale'
  },
  high: {
    name: 'Agresivo',
    description: 'El inversor agresivo busca maximizar el crecimiento de su capital y está dispuesto a asumir alta volatilidad y riesgo. Se enfoca en activos de alto potencial como acciones tecnológicas, criptomonedas y commodities especulativos. Tiene un horizonte de inversión a largo plazo y puede tolerar fluctuaciones significativas en su portafolio.',
    color: 'amber',
    icon: 'fa-rocket'
  }
};

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center bg-gray-700 p-12 rounded-xl shadow-2xl border border-gray-600">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Cargando Recomendaciones...</h2>
          <p className="text-gray-400">Por favor, espera mientras preparamos tus recomendaciones.</p>
        </div>
      </div>
    );
  }

  const { assets, metrics } = portfolio;
  
  // Determinar el perfil del inversor basado en el nivel de riesgo
  const riskLevel = portfolio.user_profile?.risk_level || 'medium';
  const investorProfile = INVESTOR_PROFILES[riskLevel] || INVESTOR_PROFILES.medium;

  const pieChartData = assets.map((asset: any) => ({
    name: asset.name,
    value: asset.allocation_pct,
  }));

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header principal */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-chart-pie text-[200px] text-teal-500"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-compass mr-4"></i>Tus Recomendaciones
          </h1>
          <p className="text-gray-300 text-xl relative z-10">
            Portafolio personalizado basado en tu perfil y objetivos
          </p>
        </div>

        {/* Sección: Tu Perfil de Inversor */}
        <div className="mb-8 bg-gray-700 rounded-xl shadow-2xl p-6 border border-gray-600">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br from-${investorProfile.color}-600 to-${investorProfile.color}-700 rounded-xl flex items-center justify-center shadow-lg`}>
              <i className={`fas ${investorProfile.icon} text-white text-xl`}></i>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-user-check text-gray-400"></i>
              Tu Perfil de Inversor
            </h2>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
            <h3 className={`text-3xl font-bold text-${investorProfile.color}-400 mb-4`}>
              Perfil {investorProfile.name}
            </h3>
            <p className="text-gray-400 text-justify leading-relaxed">
              {investorProfile.description}
            </p>
          </div>
        </div>

        {/* Contenedor principal de recomendaciones */}
        <div className="bg-gray-700 rounded-xl shadow-2xl p-8 border border-gray-600">

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
      </div>
    </div>
  );
};

export default RecommendationsPage;
