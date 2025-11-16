
import React, { useEffect, useState } from "react";
import { adminFetchConfig } from "../../services/api";

const SystemConfig = () => {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminFetchConfig()
      .then((res) => {
        setConfig(res.data || {});
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar configuración");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Configuración del Sistema</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input
          className="border rounded px-3 py-2"
          placeholder="Límite de inversión (USD)"
          value={config.investment_limit ?? ''}
          readOnly
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="API Key externa"
          value={config.api_key ?? ''}
          readOnly
        />
        <button className="bg-teal-600 text-white px-4 py-2 rounded" disabled>Guardar</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-2">Roles y Permisos</h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Gestionar roles de usuario.</li>
            <li>Configurar permisos avanzados.</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-2">Backup y Estado de Servicios</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-2" disabled>Realizar Backup</button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded mb-2" disabled>Restaurar Backup</button>
          <div className="mt-2 text-gray-700 text-sm">Estado de servicios: <span className="text-green-600">OK</span></div>
        </div>
      </div>
      {loading && <div className="text-gray-500 mt-4">Cargando configuración...</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default SystemConfig;
