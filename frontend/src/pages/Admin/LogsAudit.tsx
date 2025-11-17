
import React, { useEffect, useState } from "react";
import { adminFetchLogs, adminDeleteLog } from "../../services/api";

const LogsAudit = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    adminFetchLogs()
      .then((res) => {
        setLogs(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar logs");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (logId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este log?")) return;
    setDeletingId(logId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteLog(logId);
      setSuccessMsg("Log eliminado correctamente.");
      fetchLogs();
    } catch {
      setError("Error al eliminar log");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Logs y Auditoría</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2" placeholder="Buscar usuario..." />
        <select className="border rounded px-3 py-2">
          <option value="">Todos los tipos</option>
          <option value="login">Login</option>
          <option value="config">Config</option>
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
                  <th className="py-2 px-4">Tipo</th>
                  <th className="py-2 px-4">Descripción</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay logs registrados.</td></tr>
                ) : (
                  logs.map((l, idx) => (
                    <tr key={l._id || idx} className="border-b">
                      <td className="py-2 px-4">{l.user || l.user_id || '-'}</td>
                      <td className="py-2 px-4">{l.date ? new Date(l.date).toLocaleDateString() : (l.created_at ? new Date(l.created_at).toLocaleDateString() : '-')}</td>
                      <td className="py-2 px-4">{l.type || '-'}</td>
                      <td className="py-2 px-4">{l.desc || l.description || '-'}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(l._id)} disabled={deletingId === l._id}>
                          {deletingId === l._id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-2">Auditoría y Seguridad</h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Visualizar cambios críticos en el sistema.</li>
            <li>Registro de accesos y modificaciones.</li>
            <li>Gráficos de eventos por día/mes (próximamente).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogsAudit;
