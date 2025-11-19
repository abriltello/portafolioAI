import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import UserManagement from './UserManagement';
import PortfolioManagement from './PortfolioManagement';
import ContentManager from './ContentManager';
import SupportMessages from './SupportMessages';
import LogsAudit from './LogsAudit';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('users');

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'portfolios':
        return <PortfolioManagement />;
      case 'content':
        return <ContentManager />;
      case 'support':
        return <SupportMessages />;
      case 'logs':
        return <LogsAudit />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-primary-bg)]">
      <Sidebar onLogout={onLogout} activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 text-[var(--color-text-light)]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
