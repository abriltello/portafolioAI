
import React, { useEffect, useState } from "react";
import { adminFetchSimulations } from "../../services/api";

const SimulationMonitor = () => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<any | null>(null);

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

  const handleViewDetails = (sim: any) => {
    setSelectedSimulation(sim);
  };

  const handleCloseModal = () => {
    setSelectedSimulation(null);
  };

  const handleExport = (sim: any) => {
    const dataStr = JSON.stringify(sim, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `simulacion_${sim.portfolio_id}_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("¿Está seguro de eliminar esta simulación?")) {
      const updated = simulations.filter((_, i) => i !== index);
      setSimulations(updated);
      alert("Simulación eliminada (solo frontend)");
    }
  };

  return (
    <div className="p-8 text-black">
      <h2 className="text-xl font-bold mb-4 text-black">Monitor de Simulaciones</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="font-semibold text-lg mb-2 text-black">Historial de Simulaciones</h3>
        {loading ? (
          <div className="text-black">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow text-sm">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="py-2 px-4 text-black">Usuario</th>
                  <th className="py-2 px-4 text-black">Portafolio</th>
                  <th className="py-2 px-4 text-black">Fecha</th>
                  <th className="py-2 px-4 text-black">Parámetros</th>
                  <th className="py-2 px-4 text-black">Resultado</th>
                  <th className="py-2 px-4 text-black">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {simulations.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-black">No hay simulaciones registradas.</td></tr>
                ) : (
                  simulations.map((sim, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4 text-black">{sim.user_id}</td>
                      <td className="py-2 px-4 text-black">{sim.portfolio_id}</td>
                      <td className="py-2 px-4 text-black">{sim.timestamp ? new Date(sim.timestamp).toLocaleString() : '-'}</td>
                      <td className="py-2 px-4 text-black">
                        <pre className="whitespace-pre-wrap max-w-xs overflow-x-auto text-black">{JSON.stringify(sim.params, null, 1)}</pre>
                      </td>
                      <td className="py-2 px-4 text-black">
                        <pre className="whitespace-pre-wrap max-w-xs overflow-x-auto text-black">{JSON.stringify(sim.result, null, 1)}</pre>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(sim)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => handleExport(sim)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                          >
                            Exportar
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {selectedSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Detalles de la Simulación</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 text-black">
              <div>
                <p className="font-semibold text-black">Usuario:</p>
                <p className="text-black">{selectedSimulation.user_id}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Portafolio:</p>
                <p className="text-black">{selectedSimulation.portfolio_id}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Fecha:</p>
                <p className="text-black">
                  {selectedSimulation.timestamp
                    ? new Date(selectedSimulation.timestamp).toLocaleString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-black">Parámetros:</p>
                <pre className="bg-gray-100 p-3 rounded text-black overflow-x-auto">
                  {JSON.stringify(selectedSimulation.params, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-black">Resultado:</p>
                <pre className="bg-gray-100 p-3 rounded text-black overflow-x-auto">
                  {JSON.stringify(selectedSimulation.result, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationMonitor;
