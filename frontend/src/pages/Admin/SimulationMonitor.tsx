
import React, { useEffect, useState } from "react";
import { adminFetchSimulations } from "../../services/api";

const SimulationMonitor = () => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminFetchSimulations()
      .then((res) => {
        setSimulations(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Error al cargar simulaciones");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Monitor de Simulaciones</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="font-semibold text-lg mb-2">Historial de Simulaciones</h3>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Usuario</th>
                  <th className="py-2 px-4">Portafolio</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Parámetros</th>
                  <th className="py-2 px-4">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {simulations.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay simulaciones registradas.</td></tr>
                ) : (
                  simulations.map((sim, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4">{sim.user_id}</td>
                      <td className="py-2 px-4">{sim.portfolio_id}</td>
                      <td className="py-2 px-4">{sim.timestamp ? new Date(sim.timestamp).toLocaleString() : '-'}</td>
                      <td className="py-2 px-4">
                        <pre className="whitespace-pre-wrap max-w-xs overflow-x-auto">{JSON.stringify(sim.params, null, 1)}</pre>
                      </td>
                      <td className="py-2 px-4">
                        <pre className="whitespace-pre-wrap max-w-xs overflow-x-auto">{JSON.stringify(sim.result, null, 1)}</pre>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Aquí pueden agregarse filtros, detalles, estadísticas, etc. */}
    </div>
  );
};

export default SimulationMonitor;
