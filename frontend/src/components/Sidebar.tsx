import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', icon: '📊', path: 'overview' },
    { name: 'Recomendaciones', icon: '💡', path: 'recommendations' },
    { name: 'Mi Portafolio', icon: '💼', path: 'my-portfolio' },
    { name: 'Simulador', icon: '📈', path: 'simulator' },
    { name: 'Educación', icon: '📚', path: 'education' },
    { name: 'Noticias', icon: '📰', path: 'news' },
    { name: 'Soporte', icon: '💬', path: 'support' },
  ];

  const handleNavigation = (path: string) => {
    setActivePage(path);
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg p-6 flex flex-col fixed h-full m-4">
      <div className="text-3xl font-bold text-blue-600 mb-8 text-center">PortafolioAI</div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={clsx(
                  "w-full flex items-center p-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200",
                  activePage === item.path && "bg-blue-100 text-blue-700 font-semibold"
                )}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <span className="mr-3 text-xl">➡️</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
