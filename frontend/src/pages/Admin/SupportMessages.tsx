
import React, { useEffect, useState } from "react";
import { adminFetchSupportMessages, adminDeleteSupportMessage } from "../../services/api";

const SupportMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    adminFetchSupportMessages()
      .then((res) => {
        setMessages(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar mensajes de soporte");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este mensaje?")) return;
    setDeletingId(messageId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteSupportMessage(messageId);
      setSuccessMsg("Mensaje eliminado correctamente.");
      fetchMessages();
    } catch {
      setError("Error al eliminar mensaje");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Soporte y Mensajes</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2" placeholder="Buscar usuario..." />
        <select className="border rounded px-3 py-2">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
        </select>
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
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4">Mensaje</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay mensajes registrados.</td></tr>
                ) : (
                  messages.map((m, idx) => (
                    <tr key={m._id || idx} className="border-b">
                      <td className="py-2 px-4">{m.user || m.user_id || '-'}</td>
                      <td className="py-2 px-4">{m.date ? new Date(m.date).toLocaleDateString() : (m.created_at ? new Date(m.created_at).toLocaleDateString() : '-')}</td>
                      <td className="py-2 px-4">{m.status || '-'}</td>
                      <td className="py-2 px-4">{m.msg || m.message || '-'}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="text-blue-600 hover:underline">Responder</button>
                        <button className="text-green-600 hover:underline">Marcar resuelto</button>
                        <button className="text-gray-600 hover:underline">Asignar</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(m._id)} disabled={deletingId === m._id}>
                          {deletingId === m._id ? "Eliminando..." : "Eliminar"}
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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-2">Estadísticas de Soporte</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Tiempo de respuesta promedio (ejemplo: 2h).</li>
          <li>Nivel de satisfacción de usuarios (próximamente).</li>
          <li>Gráficos de tickets por día/mes (próximamente).</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportMessages;
