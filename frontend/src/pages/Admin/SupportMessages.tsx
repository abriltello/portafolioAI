
import React, { useEffect, useState } from "react";
import { adminFetchSupportMessages, adminDeleteSupportMessage } from "../../services/api";

const SupportMessages = () => {
    // Handler para marcar como resuelto
    const handleMarkResolved = async (messageId: string) => {
      setSuccessMsg(null);
      setError(null);
      try {
        await fetch(`/api/admin/support/messages/${messageId}/resolve`, { method: 'PATCH' });
        setSuccessMsg('Mensaje marcado como resuelto.');
        fetchMessages();
      } catch {
        setError('Error al marcar como resuelto');
      }
    };

    // Handler para asignar (simulado)
    const handleAssign = async (messageId: string) => {
      setSuccessMsg(null);
      setError(null);
      // Aquí podrías abrir un modal para seleccionar admin, por ahora solo feedback
      setSuccessMsg('Mensaje asignado (simulado).');
    };

    // Handler para responder (simulado)
    const handleReply = (messageId: string) => {
      // Aquí podrías abrir un modal para responder, por ahora solo feedback
      setSuccessMsg('Funcionalidad de respuesta próximamente.');
    };
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
        <input className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]" placeholder="Buscar usuario..." />
        <select className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]">
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
            <table className="min-w-full bg-[var(--color-card-bg)] text-[var(--color-text-light)] rounded shadow">
              <thead>
                <tr className="bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]">
                  <th className="py-2 px-4">Usuario</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4">Mensaje</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-light)]">
                {messages.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay mensajes registrados.</td></tr>
                ) : (
                  messages.map((m, idx) => (
                    <tr key={m._id || idx} className="border-b text-[var(--color-text-light)]">
                      <td className="py-2 px-4 text-[var(--color-text-light)]">{m.user && m.user.trim() !== '' ? m.user : (m.name || '-')}</td>
                      <td className="py-2 px-4 text-[var(--color-text-light)]">{
                        (() => {
                          if (m.created_at) {
                            // Si es string ISO o número
                            if (typeof m.created_at === 'string' || typeof m.created_at === 'number') {
                              const d = new Date(m.created_at);
                              return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                            }
                            // Si es objeto MongoDB
                            if (m.created_at && m.created_at.$date) {
                              const d = new Date(m.created_at.$date);
                              return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                            }
                          }
                          if (m.date) {
                            const d = new Date(m.date);
                            return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                          }
                          return '-';
                        })()
                      }</td>
                      <td className="py-2 px-4 text-[var(--color-text-light)]">{m.status || 'pendiente'}</td>
                      <td className="py-2 px-4 text-[var(--color-text-light)]">{m.message || '-'}</td>
                      <td className="py-2 px-4 flex gap-2 text-[var(--color-text-light)]">
                        <button className="text-blue-600 hover:underline" onClick={() => handleReply(m._id)}>Responder</button>
                        <button className="text-green-600 hover:underline" onClick={() => handleMarkResolved(m._id)}>Marcar resuelto</button>
                        <button className="text-gray-600 hover:underline" onClick={() => handleAssign(m._id)}>Asignar</button>
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
