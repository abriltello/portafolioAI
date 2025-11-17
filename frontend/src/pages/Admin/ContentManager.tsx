
import React, { useEffect, useState } from "react";
import { adminFetchContent, adminDeleteContent } from "../../services/api";

const ContentManager = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Estados para el formulario de nuevo artículo
  const [newArticle, setNewArticle] = useState({
    title: "",
    type: "Educativo",
    url: "",
    description: "",
    author: "",
  });

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

  const handleAddArticle = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewArticle({
      title: "",
      type: "Educativo",
      url: "",
      description: "",
      author: "",
    });
  };

  const handleSubmitNewArticle = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!newArticle.title.trim()) {
      alert("El título es obligatorio");
      return;
    }
    if (!newArticle.url.trim()) {
      alert("La URL es obligatoria");
      return;
    }
    
    // Validar formato de URL
    try {
      new URL(newArticle.url);
    } catch {
      alert("Por favor ingrese una URL válida (debe incluir http:// o https://)");
      return;
    }

    // Aquí se haría la petición al backend
    const articleToAdd = {
      ...newArticle,
      date: new Date().toISOString(),
      views: 0,
      _id: `temp_${Date.now()}`, // ID temporal
    };

    setArticles([articleToAdd, ...articles]);
    setSuccessMsg("Artículo agregado correctamente (solo frontend)");
    handleCloseAddModal();
  };

  const handleViewDetails = (article: any) => {
    setSelectedArticle(article);
    setShowViewModal(true);
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setNewArticle({
      title: article.title || "",
      type: article.type || "Educativo",
      url: article.url || "",
      description: article.description || "",
      author: article.author || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedArticles = articles.map((a) =>
      a._id === selectedArticle._id ? { ...a, ...newArticle } : a
    );
    
    setArticles(updatedArticles);
    setSuccessMsg("Artículo actualizado correctamente (solo frontend)");
    setShowEditModal(false);
    setSelectedArticle(null);
    setNewArticle({
      title: "",
      type: "Educativo",
      url: "",
      description: "",
      author: "",
    });
  };

  // Filtrado de artículos
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || article.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 text-black">
      <h2 className="text-xl font-bold mb-4 text-black">Gestión de Contenido</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input
          className="border rounded px-3 py-2 text-black"
          placeholder="Buscar artículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-black"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="Educativo">Educativo</option>
          <option value="Noticia">Noticia</option>
        </select>
        <button
          className="ml-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          onClick={handleAddArticle}
        >
          + Nuevo Artículo
        </button>
      </div>
      <div className="overflow-x-auto mb-8">
        {loading ? (
          <div className="text-black">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="py-2 px-4 text-black">Título</th>
                  <th className="py-2 px-4 text-black">Tipo</th>
                  <th className="py-2 px-4 text-black">Fecha</th>
                  <th className="py-2 px-4 text-black">Vistas</th>
                  <th className="py-2 px-4 text-black">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-black">
                      No hay artículos registrados.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((a, idx) => (
                    <tr key={a._id || idx} className="border-b">
                      <td className="py-2 px-4 text-black">{a.title || "-"}</td>
                      <td className="py-2 px-4 text-black">{a.type || "-"}</td>
                      <td className="py-2 px-4 text-black">
                        {a.date ? new Date(a.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4 text-black">{a.views ?? "-"}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                            onClick={() => handleViewDetails(a)}
                          >
                            Ver
                          </button>
                          <button
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                            onClick={() => handleEdit(a)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                            onClick={() => handleDelete(a._id)}
                            disabled={deletingId === a._id}
                          >
                            {deletingId === a._id ? "..." : "Eliminar"}
                          </button>
                        </div>
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
        <h3 className="font-semibold text-lg mb-2 text-black">Estadísticas de Contenido</h3>
        <ul className="list-disc pl-5 text-black text-sm">
          <li>Total de artículos: {articles.length}</li>
          <li>Artículos educativos: {articles.filter((a) => a.type === "Educativo").length}</li>
          <li>Noticias: {articles.filter((a) => a.type === "Noticia").length}</li>
          <li>Vistas totales: {articles.reduce((sum, a) => sum + (a.views || 0), 0)}</li>
        </ul>
      </div>

      {/* Modal para agregar nuevo artículo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Agregar Nuevo Artículo</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitNewArticle} className="space-y-4">
              <div>
                <label className="block text-black font-semibold mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Título del artículo"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  URL del Artículo <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.url}
                  onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                  placeholder="https://ejemplo.com/articulo"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Tipo</label>
                <select
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.type}
                  onChange={(e) => setNewArticle({ ...newArticle, type: e.target.value })}
                >
                  <option value="Educativo">Educativo</option>
                  <option value="Noticia">Noticia</option>
                </select>
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Autor</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.author}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                  placeholder="Nombre del autor"
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Descripción</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                  placeholder="Descripción breve del artículo"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar artículo */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Editar Artículo</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateArticle} className="space-y-4">
              <div>
                <label className="block text-black font-semibold mb-1">Título</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">URL del Artículo</label>
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.url}
                  onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Tipo</label>
                <select
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.type}
                  onChange={(e) => setNewArticle({ ...newArticle, type: e.target.value })}
                >
                  <option value="Educativo">Educativo</option>
                  <option value="Noticia">Noticia</option>
                </select>
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Autor</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.author}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">Descripción</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-black"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Actualizar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showViewModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Detalles del Artículo</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 text-black">
              <div>
                <p className="font-semibold text-black">Título:</p>
                <p className="text-black">{selectedArticle.title || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Tipo:</p>
                <p className="text-black">{selectedArticle.type || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-black">URL:</p>
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedArticle.url || "-"}
                </a>
              </div>
              <div>
                <p className="font-semibold text-black">Autor:</p>
                <p className="text-black">{selectedArticle.author || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Fecha:</p>
                <p className="text-black">
                  {selectedArticle.date
                    ? new Date(selectedArticle.date).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-black">Vistas:</p>
                <p className="text-black">{selectedArticle.views ?? "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Descripción:</p>
                <p className="text-black">{selectedArticle.description || "-"}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
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

export default ContentManager;
