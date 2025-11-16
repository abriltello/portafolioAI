
import React, { useEffect, useState } from "react";
import { adminFetchUsers, adminDeleteUser } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    adminFetchUsers()
      .then((res) => {
        setUsers(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar usuarios");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setDeletingId(userId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteUser(userId);
      setSuccessMsg("Usuario eliminado correctamente.");
      fetchUsers();
    } catch {
      setError("Error al eliminar usuario");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2" placeholder="Buscar usuario..." />
        <select className="border rounded px-3 py-2">
          <option value="">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded">Exportar CSV</button>
      </div>
      <div className="overflow-x-auto">
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
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Rol</th>
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4">Registro</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No hay usuarios registrados.</td></tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user._id || idx} className="border-b">
                      <td className="py-2 px-4">{user.name || user.full_name || user.username || '-'}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.role}</td>
                      <td className="py-2 px-4">{user.status || (user.is_blocked ? 'bloqueado' : 'activo')}</td>
                      <td className="py-2 px-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="text-blue-600 hover:underline">Editar</button>
                        <button className="text-yellow-600 hover:underline">Resetear</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(user._id)} disabled={deletingId === user._id}>
                          {deletingId === user._id ? "Eliminando..." : "Eliminar"}
                        </button>
                        <button className="text-gray-600 hover:underline">Historial</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
