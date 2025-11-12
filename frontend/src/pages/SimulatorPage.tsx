import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SimulatorPageProps {
  portfolio: any;
}

const SimulatorPage: React.FC<SimulatorPageProps> = ({ portfolio }) => {
  const [amount, setAmount] = useState(10000);
  const [horizon, setHorizon] = useState(12); // Meses
  const [riskAversion, setRiskAversion] = useState(50); // 0-100
  const [simulationData, setSimulationData] = useState<any[]>([]);

  useEffect(() => {
    runSimulation();
  }, [amount, horizon, riskAversion, portfolio]);

  const runSimulation = () => {
    if (!portfolio) return;

    const data = [];
    let currentAmount = amount;
    const monthlyReturn = (portfolio.metrics.expected_return / 12) * (riskAversion / 100 + 0.5); // Ajuste simple por aversión al riesgo
    const monthlyRisk = (portfolio.metrics.risk / 12) * (1 - riskAversion / 100 + 0.5); // Ajuste simple por aversión al riesgo

    for (let i = 0; i <= horizon; i++) {
      const month = `Mes ${i}`;
      if (i > 0) {
        const fluctuation = (Math.random() * 2 - 1) * monthlyRisk * currentAmount; // +/- riesgo
        currentAmount *= (1 + monthlyReturn);
        currentAmount += fluctuation;
      }
      data.push({
        name: month,
        'Valor Proyectado': Math.round(currentAmount),
      });
    }
    setSimulationData(data);
  };

  return (
    <div className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      {/* Título con icono */}
      <div className="flex items-center gap-3 mb-8">
        <i className="fas fa-calculator text-teal-400 text-3xl"></i>
        <h1 className="text-3xl font-bold text-white">Simulador de Portafolio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Controles del Simulador */}
        <div className="lg:col-span-1 space-y-6 bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-sliders-h text-teal-400"></i>
            Parámetros
          </h2>
          
          {/* Monto Inicial */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-dollar-sign text-teal-400"></i>
                Monto Inicial
              </span>
              <span className="text-teal-400 text-lg">${amount.toLocaleString()}</span>
            </label>
            <input
              type="range"
              id="amount"
              min="1000" max="100000" step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((amount - 1000) / (100000 - 1000)) * 100}%, #4b5563 ${((amount - 1000) / (100000 - 1000)) * 100}%, #4b5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>
          
          {/* Horizonte de Inversión */}
          <div>
            <label htmlFor="horizon" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-calendar-alt text-teal-400"></i>
                Horizonte
              </span>
              <span className="text-teal-400 text-lg">{horizon} meses</span>
            </label>
            <input
              type="range"
              id="horizon"
              min="6" max="60" step="6"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((horizon - 6) / (60 - 6)) * 100}%, #4b5563 ${((horizon - 6) / (60 - 6)) * 100}%, #4b5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>6 meses</span>
              <span>5 años</span>
            </div>
          </div>
          
          {/* Aversión al Riesgo */}
          <div>
            <label htmlFor="riskAversion" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-amber-400"></i>
                Tolerancia al Riesgo
              </span>
              <span className="text-amber-400 text-lg">{riskAversion}%</span>
            </label>
            <input
              type="range"
              id="riskAversion"
              min="0" max="100" step="10"
              value={riskAversion}
              onChange={(e) => setRiskAversion(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${riskAversion}%, #4b5563 ${riskAversion}%, #4b5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Conservador</span>
              <span>Agresivo</span>
            </div>
          </div>
        </div>

        {/* Resultados del Simulador */}
        <div className="lg:col-span-2 bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-teal-400"></i>
            Resultados Proyectados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valor Final Estimado */}
            <div className="flex items-center bg-gray-800 p-5 rounded-lg border border-gray-600">
              <div className="bg-teal-600/20 p-3 rounded-lg mr-4">
                <i className="fas fa-dollar-sign text-teal-400 text-3xl"></i>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Valor Final Estimado</p>
                <p className="text-2xl font-bold text-teal-400">
                  ${simulationData.length > 0 ? simulationData[simulationData.length - 1]['Valor Proyectado'].toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Ganancia Estimada */}
            <div className="flex items-center bg-gray-800 p-5 rounded-lg border border-gray-600">
              <div className="bg-green-600/20 p-3 rounded-lg mr-4">
                <i className="fas fa-arrow-up text-green-400 text-3xl"></i>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Ganancia Estimada</p>
                <p className="text-2xl font-bold text-green-400">
                  ${simulationData.length > 0 ? (simulationData[simulationData.length - 1]['Valor Proyectado'] - amount).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución del Portafolio */}
      <div className="mt-8 bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-chart-line text-teal-400"></i>
          Evolución del Portafolio
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={simulationData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
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
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Valor Proyectado']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="Valor Proyectado" 
              stroke="#14b8a6" 
              strokeWidth={3}
              activeDot={{ r: 8, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }} 
              dot={{ fill: '#14b8a6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimulatorPage;
