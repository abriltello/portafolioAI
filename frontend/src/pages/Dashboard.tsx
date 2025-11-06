import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardOverview from '../components/DashboardOverview';
import RecommendationsPage from './RecommendationsPage';
import MyPortfolioPage from './MyPortfolioPage';
import SimulatorPage from './SimulatorPage';
import EducationPage from './EducationPage';
import NewsPage from './NewsPage';
import SupportPage from './SupportPage';
import { Route, Routes, useLocation } from 'react-router-dom';

interface DashboardProps {
  onLogout: () => void;
  portfolio: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, portfolio }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>(
    location.pathname.split('/')[2] || 'overview'
  );

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'overview': return 'Resumen';
      case 'recommendations': return 'Recomendaciones';
      case 'my-portfolio': return 'Mi Portafolio';
      case 'simulator': return 'Simulador';
      case 'education': return 'Educación';
      case 'news': return 'Noticias';
      case 'support': return 'Soporte';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">{getPageTitle(activePage)}</h1>
          {/* Aquí podrías añadir elementos del header como notificaciones o perfil de usuario */}
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="overview" element={<DashboardOverview portfolio={portfolio} />} />
            <Route path="recommendations" element={<RecommendationsPage portfolio={portfolio} />} />
            <Route path="my-portfolio" element={<MyPortfolioPage portfolio={portfolio} />} />
            <Route path="simulator" element={<SimulatorPage portfolio={portfolio} />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<DashboardOverview portfolio={portfolio} />} /> {/* Default route */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
