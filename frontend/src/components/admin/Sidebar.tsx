import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between shadow-lg">
      <div>
        <div className="p-6 text-2xl font-bold text-violet-600">PortafolioAI Admin</div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/users' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Gestión de Usuarios</Link>
            </li>
            <li>
              <Link to="/admin/portfolios" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/portfolios' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Gestión de Portafolios</Link>
            </li>
            <li>
              <Link to="/admin/simulations" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/simulations' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Monitor de Simulaciones</Link>
            </li>
            <li>
              <Link to="/admin/content" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/content' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Contenido Educativo & Noticias</Link>
            </li>
            <li>
              <Link to="/admin/support" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/support' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Soporte / Mensajes</Link>
            </li>
            <li>
              <Link to="/admin/config" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/config' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Configuración del Sistema</Link>
            </li>
            <li>
              <Link to="/admin/logs" className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin/logs' ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'}`}>Logs y Auditoría</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-6 border-t flex items-center gap-3">
        <span className="font-semibold text-gray-700">Admin</span>
        <button className="ml-auto flex items-center gap-2 text-red-500 hover:text-red-700">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
