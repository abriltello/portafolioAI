
import React, { useEffect, useState } from "react";
import { adminFetchContent, adminDeleteContent } from "../../services/api";

const ContentManager = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchContent = () => {
    setLoading(true);
    adminFetchContent()
      .then((res) => {
        setArticles(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar contenido");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (contentId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este artículo?")) return;
    setDeletingId(contentId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteContent(contentId);
      setSuccessMsg("Artículo eliminado correctamente.");
      fetchContent();
    } catch {
      setError("Error al eliminar artículo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Gestión de Contenido</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2" placeholder="Buscar artículo..." />
        <select className="border rounded px-3 py-2">
          <option value="">Todos los tipos</option>
          <option value="Educativo">Educativo</option>
          <option value="Noticia">Noticia</option>
        </select>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded">Nuevo Artículo</button>
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
                  <th className="py-2 px-4">Título</th>
                  <th className="py-2 px-4">Tipo</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Vistas</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No hay artículos registrados.</td></tr>
                ) : (
                  articles.map((a, idx) => (
                    <tr key={a._id || idx} className="border-b">
                      <td className="py-2 px-4">{a.title || '-'}</td>
                      <td className="py-2 px-4">{a.type || '-'}</td>
                      <td className="py-2 px-4">{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4">{a.views ?? '-'}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="text-blue-600 hover:underline">Editar</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(a._id)} disabled={deletingId === a._id}>
                          {deletingId === a._id ? "Eliminando..." : "Eliminar"}
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
        <h3 className="font-semibold text-lg mb-2">Estadísticas de Contenido</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Artículos más leídos (ejemplo: ¿Qué es un ETF?).</li>
          <li>Gráficos de actividad por día/mes (próximamente).</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentManager;
