import Sidebar from '../../components/admin/Sidebar';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-primary-bg)]">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 p-8 text-[var(--color-text-light)]">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aquí puedes agregar widgets/resúmenes */}
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Gestión de usuarios</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Gestión de portafolios</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Monitor de simulaciones</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Gestión de contenido</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Soporte y mensajes</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Configuración del sistema</div>
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">Logs y auditoría</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
