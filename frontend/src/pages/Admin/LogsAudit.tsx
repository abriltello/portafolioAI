
import React, { useEffect, useState } from "react";
import { adminFetchLogs, adminDeleteLog } from "../../services/api";

const LogsAudit = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filtros
  const [searchUser, setSearchUser] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleExportCSV = () => {
    const headers = ["Usuario", "Fecha", "Tipo", "Nivel", "Descripción", "IP"];
    const csvData = filteredLogs.map((log) => [
      log.user || log.user_id || "-",
      log.date
        ? new Date(log.date).toLocaleString()
        : log.created_at
        ? new Date(log.created_at).toLocaleString()
        : "-",
      log.type || "-",
      log.severity || "-",
      log.desc || log.description || "-",
      log.ip_address || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_auditoria_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccessMsg("CSV exportado correctamente.");
  };

  const handleClearFilters = () => {
    setSearchUser("");
    setFilterType("");
    setFilterSeverity("");
    setDateFrom("");
    setDateTo("");
  };

  // Filtrado de logs
  const filteredLogs = logs.filter((log) => {
    const user = log.user || log.user_id || "";
    const matchesUser = user.toLowerCase().includes(searchUser.toLowerCase());
    const matchesType = filterType === "" || log.type === filterType;
    const matchesSeverity = filterSeverity === "" || log.severity === filterSeverity;

    let matchesDate = true;
    const logDate = log.date ? new Date(log.date) : log.created_at ? new Date(log.created_at) : null;
    if (logDate) {
      if (dateFrom) {
        matchesDate = matchesDate && logDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && logDate <= new Date(dateTo + "T23:59:59");
      }
    }

    return matchesUser && matchesType && matchesSeverity && matchesDate;
  });

  // Estadísticas
  const stats = {
    total: logs.length,
    today: logs.filter((l) => {
      const logDate = l.date ? new Date(l.date) : l.created_at ? new Date(l.created_at) : null;
      const today = new Date();
      return (
        logDate &&
        logDate.toDateString() === today.toDateString()
      );
    }).length,
    critical: logs.filter((l) => l.severity === "critical" || l.severity === "error").length,
    byType: {
      login: logs.filter((l) => l.type === "login").length,
      config: logs.filter((l) => l.type === "config").length,
      content: logs.filter((l) => l.type === "content").length,
      user: logs.filter((l) => l.type === "user").length,
      portfolio: logs.filter((l) => l.type === "portfolio").length,
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "error":
        return "bg-orange-100 text-orange-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "login":
        return "🔐";
      case "config":
        return "⚙️";
      case "content":
        return "📄";
      case "user":
        return "👤";
      case "portfolio":
        return "💼";
      case "security":
        return "🛡️";
      default:
        return "📋";
    }
  };

  return (
    <div className="p-8 text-black">
      <h2 className="text-2xl font-bold mb-6 text-black">Logs y Auditoría</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total de Logs</p>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Hoy</p>
          <p className="text-2xl font-bold text-black">{stats.today}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Críticos</p>
          <p className="text-2xl font-bold text-black">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Logins</p>
          <p className="text-2xl font-bold text-black">{stats.byType.login}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-semibold text-lg mb-3 text-black">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Buscar usuario..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 text-black"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="login">Login</option>
            <option value="config">Configuración</option>
            <option value="content">Contenido</option>
            <option value="user">Usuario</option>
            <option value="portfolio">Portafolio</option>
            <option value="security">Seguridad</option>
          </select>
          <select
            className="border rounded px-3 py-2 text-black"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            <option value="critical">Crítico</option>
            <option value="error">Error</option>
            <option value="warning">Advertencia</option>
            <option value="info">Info</option>
          </select>
          <input
            type="date"
            className="border rounded px-3 py-2 text-black"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-2 text-black"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
              onClick={handleClearFilters}
            >
              Limpiar
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
              onClick={handleExportCSV}
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {loading ? (
          <div className="p-6 text-black">Cargando logs...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <>
            {successMsg && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded">
                {successMsg}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-black border-b">
                    <th className="py-3 px-4 text-left text-black">Tipo</th>
                    <th className="py-3 px-4 text-left text-black">Usuario</th>
                    <th className="py-3 px-4 text-left text-black">Fecha/Hora</th>
                    <th className="py-3 px-4 text-left text-black">Nivel</th>
                    <th className="py-3 px-4 text-left text-black">Descripción</th>
                    <th className="py-3 px-4 text-left text-black">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No hay logs que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <tr key={log._id || idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-black">
                          <span className="text-xl" title={log.type}>
                            {getTypeIcon(log.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-black font-medium">
                          {log.user || log.user_id || "-"}
                        </td>
                        <td className="py-3 px-4 text-black text-sm">
                          {log.date
                            ? new Date(log.date).toLocaleString()
                            : log.created_at
                            ? new Date(log.created_at).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                              log.severity
                            )}`}
                          >
                            {log.severity || "info"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-black text-sm max-w-md truncate">
                          {log.desc || log.description || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                              onClick={() => handleViewDetails(log)}
                            >
                              Ver
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                              onClick={() => handleDelete(log._id)}
                              disabled={deletingId === log._id}
                            >
                              {deletingId === log._id ? "..." : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t">
              <p className="text-sm text-black">
                Mostrando {filteredLogs.length} de {logs.length} logs
              </p>
            </div>
          </>
        )}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-3 text-black">📊 Distribución por Tipo</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-black">🔐 Logins</span>
              <span className="font-bold text-black">{stats.byType.login}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">⚙️ Configuración</span>
              <span className="font-bold text-black">{stats.byType.config}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">📄 Contenido</span>
              <span className="font-bold text-black">{stats.byType.content}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">👤 Usuarios</span>
              <span className="font-bold text-black">{stats.byType.user}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">💼 Portafolios</span>
              <span className="font-bold text-black">{stats.byType.portfolio}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-3 text-black">🛡️ Auditoría y Seguridad</h3>
          <ul className="list-disc pl-5 text-black text-sm space-y-2">
            <li>Registro completo de todas las acciones del sistema</li>
            <li>Trazabilidad de cambios críticos</li>
            <li>Detección de actividad sospechosa</li>
            <li>Cumplimiento de normativas financieras</li>
            <li>Exportación de logs para análisis externo</li>
            <li>Filtrado avanzado por fecha, tipo y usuario</li>
          </ul>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Detalles del Log</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-black">ID:</p>
                  <p className="text-black text-sm">{selectedLog._id || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Tipo:</p>
                  <p className="text-black">
                    {getTypeIcon(selectedLog.type)} {selectedLog.type || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-black">Usuario:</p>
                  <p className="text-black">{selectedLog.user || selectedLog.user_id || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Nivel:</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                      selectedLog.severity
                    )}`}
                  >
                    {selectedLog.severity || "info"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-black">Fecha:</p>
                  <p className="text-black text-sm">
                    {selectedLog.date
                      ? new Date(selectedLog.date).toLocaleString()
                      : selectedLog.created_at
                      ? new Date(selectedLog.created_at).toLocaleString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-black">IP:</p>
                  <p className="text-black text-sm">{selectedLog.ip_address || "-"}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-black mb-2">Descripción:</p>
                <p className="text-black bg-gray-100 p-3 rounded">
                  {selectedLog.desc || selectedLog.description || "-"}
                </p>
              </div>
              {selectedLog.details && (
                <div>
                  <p className="font-semibold text-black mb-2">Detalles Adicionales:</p>
                  <pre className="text-black bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
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

export default LogsAudit;
