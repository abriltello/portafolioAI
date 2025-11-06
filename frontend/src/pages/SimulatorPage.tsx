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
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Simulador de Portafolio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Controles del Simulador */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label htmlFor="amount" className="block text-lg font-medium text-slate-800 mb-2">Monto Inicial: ${amount}</label>
            <input
              type="range"
              id="amount"
              min="1000" max="100000" step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
          </div>
          <div>
            <label htmlFor="horizon" className="block text-lg font-medium text-slate-800 mb-2">Horizonte de Inversión: {horizon} meses</label>
            <input
              type="range"
              id="horizon"
              min="6" max="60" step="6"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
          </div>
          <div>
            <label htmlFor="riskAversion" className="block text-lg font-medium text-slate-800 mb-2">Aversión al Riesgo: {riskAversion}</label>
            <input
              type="range"
              id="riskAversion"
              min="0" max="100" step="10"
              value={riskAversion}
              onChange={(e) => setRiskAversion(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
          </div>
        </div>

        {/* Resultados del Simulador */}
        <div className="lg:col-span-2 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Resultados Proyectados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-blue-500 text-3xl mr-3">💰</span>
              <div>
                <p className="text-slate-600 text-sm">Valor Final Estimado</p>
                <p className="text-xl font-bold text-slate-900">${simulationData.length > 0 ? simulationData[simulationData.length - 1]['Valor Proyectado'].toLocaleString() : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-green-500 text-3xl mr-3">📈</span>
              <div>
                <p className="text-slate-600 text-sm">Ganancia Estimada</p>
                <p className="text-xl font-bold text-slate-900">${simulationData.length > 0 ? (simulationData[simulationData.length - 1]['Valor Proyectado'] - amount).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución del Portafolio */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Evolución del Portafolio</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={simulationData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="Valor Proyectado" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimulatorPage;
