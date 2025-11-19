import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  return (
    <aside className="w-72 bg-[var(--color-card-bg)] border-r border-[var(--color-secondary-bg)] min-h-screen flex flex-col justify-between shadow-lg text-[var(--color-text-light)]">
      <div>
        <div className="p-6 text-2xl font-bold text-[var(--color-accent-teal)]">PortafolioAI Admin</div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/users' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Gestión de Usuarios</Link>
            </li>
            <li>
              <Link to="/admin/portfolios" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/portfolios' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Gestión de Portafolios</Link>
            </li>
            <li>
              <Link to="/admin/simulations" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/simulations' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Monitor de Simulaciones</Link>
            </li>
            <li>
              <Link to="/admin/content" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/content' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Contenido Educativo & Noticias</Link>
            </li>
            <li>
              <Link to="/admin/support" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/support' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Soporte / Mensajes</Link>
            </li>
            <li>
              <Link to="/admin/config" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/config' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Configuración del Sistema</Link>
            </li>
            <li>
              <Link to="/admin/logs" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/logs' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}>Logs y Auditoría</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-6 border-t border-[var(--color-secondary-bg)] flex items-center gap-3">
        <span className="font-semibold text-[var(--color-text-light)]">Admin</span>
        <button className="ml-auto flex items-center gap-2 text-red-400 hover:text-red-600" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
