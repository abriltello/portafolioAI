
import React, { useEffect, useState } from "react";
import { adminFetchPortfolios, adminDeletePortfolio } from "../../services/api";

const PortfolioManagement = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchPortfolios = () => {
    setLoading(true);
    adminFetchPortfolios()
      .then((res) => {
        setPortfolios(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar portafolios");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (portfolioId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este portafolio?")) return;
    setDeletingId(portfolioId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeletePortfolio(portfolioId);
      setSuccessMsg("Portafolio eliminado correctamente.");
      fetchPortfolios();
    } catch {
      setError("Error al eliminar portafolio");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Gestión de Portafolios</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2" placeholder="Buscar usuario..." />
        <select className="border rounded px-3 py-2">
          <option value="">Todos los riesgos</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded">Exportar CSV</button>
      </div>
      <div className="overflow-x-auto mb-8">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Usuario</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Perfil de riesgo</th>
                  <th className="py-2 px-4"># Activos</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay portafolios registrados.</td></tr>
                ) : (
                  portfolios.map((p, idx) => (
                    <tr key={p._id || idx} className="border-b">
                      <td className="py-2 px-4">{p.user_id}</td>
                      <td className="py-2 px-4">{p.generated_at ? new Date(p.generated_at).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4">{p.metrics?.risk_level || '-'}</td>
                      <td className="py-2 px-4">{p.assets ? p.assets.length : 0}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="text-blue-600 hover:underline">Ver</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(p._id)} disabled={deletingId === p._id}>
                          {deletingId === p._id ? "Eliminando..." : "Eliminar"}
                        </button>
                        <button className="text-yellow-600 hover:underline">Regenerar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-2">Estadísticas y Métricas</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Distribución de perfiles de riesgo (ejemplo: bajo 1, medio 1, alto 1).</li>
          <li>Activos más recomendados (ejemplo: Apple, Tesla, Bitcoin).</li>
          <li>Gráficos de portafolios por día/mes (próximamente).</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioManagement;
