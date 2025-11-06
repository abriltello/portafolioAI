import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardOverviewProps {
  portfolio: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Cargando Portafolio...</h2>
        <p className="text-slate-600 mt-2">Por favor, espera mientras preparamos tus recomendaciones.</p>
      </div>
    );
  }

  const { metrics, assets } = portfolio;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Tarjeta Principal: Resumen del Portafolio */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Tu Portafolio Actual</h2>
        <p className="text-slate-600 mb-6">Basado en tu perfil de riesgo, hemos diseñado el siguiente portafolio:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Retorno Esperado Anual</h3>
            <p className="text-3xl font-bold text-blue-600">{(metrics.expected_return * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Nivel de Riesgo</h3>
            <p className="text-3xl font-bold text-green-600">{(metrics.risk * 100).toFixed(2)}%</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">Distribución de Activos</h3>
        <ul className="list-disc list-inside mb-6">
          {assets.map((asset: any, index: number) => (
            <li key={index} className="text-slate-700">
              {asset.name} ({asset.ticker}): {asset.allocation_pct.toFixed(2)}%
            </li>
          ))}
        </ul>

        <Link to="/dashboard/recommendations">
          <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Ver mi Estrategia Completa
          </button>
        </Link>
      </div>

      {/* Tarjeta de Acciones Rápidas */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div className="space-y-4">
          <button className="w-full bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
            Simular Inversión
          </button>
          <button className="w-full bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-600 transition duration-300">
            Actualizar Perfil
          </button>
          <button className="w-full bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">
            Ver Últimas Noticias
          </button>
          <button className="w-full bg-teal-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-600 transition duration-300">
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
