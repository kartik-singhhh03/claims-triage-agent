import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LayoutContainer from './components/layout/LayoutContainer';
import DashboardPage from './pages/DashboardPage';
import ClaimsPage from './pages/ClaimsPage';
import QueuesPage from './pages/QueuesPage';
import RulesPage from './pages/RulesPage';
import { RealtimeProvider, useRealtime } from './contexts/RealtimeContext';
import { ToastProvider } from './contexts/ToastContext';
import './App.css';

type PagePath = '/dashboard' | '/claims' | '/queues' | '/rules' | '/settings' | '/';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PagePath>('/');
  const [dashboardParams, setDashboardParams] = useState<{ claimId?: string } | null>(null);
  const { isConnected: isRealtimeConnected } = useRealtime();

  const handleNavigate = (path: string) => {
    if (path.startsWith('/dashboard?')) {
      const params = new URLSearchParams(path.split('?')[1]);
      const claimId = params.get('claim_id');
      setDashboardParams(claimId ? { claimId } : null);
      setCurrentPage('/dashboard');
    } else {
      setCurrentPage(path as PagePath);
      setDashboardParams(null);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setCurrentPage('/claims');
    console.log('Search query:', query);
  };

  const handleGetStarted = () => {
    setCurrentPage('/dashboard');
  };

  const handleWatchDemo = () => {
    console.log('Watch demo clicked');
  };

  const handleEarlyAccess = () => {
    console.log('Get early access clicked');
  };

  const renderPage = () => {
    switch (currentPage) {
      case '/dashboard':
        return <DashboardPage claimId={dashboardParams?.claimId} />;
      case '/claims':
        return <ClaimsPage />;
      case '/queues':
        return <QueuesPage />;
      case '/rules':
        return <RulesPage />;
      case '/':
        return (
          <LandingPage
            onGetStarted={handleGetStarted}
            onWatchDemo={handleWatchDemo}
            onEarlyAccess={handleEarlyAccess}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <DashboardPage />;
    }
  };

  // Show landing page if on home page
  if (currentPage === '/') {
    return (
      <div className="app">
        <LandingPage
          onGetStarted={handleGetStarted}
          onWatchDemo={handleWatchDemo}
          onEarlyAccess={handleEarlyAccess}
          onNavigate={handleNavigate}
        />
      </div>
    );
  }

  // Show app layout for all other pages
  return (
    <div className="app">
      <LayoutContainer
        currentPath={currentPage}
        onNavigate={handleNavigate}
        onSearchSubmit={handleSearchSubmit}
        isRealtimeConnected={isRealtimeConnected}
      >
        {renderPage()}
      </LayoutContainer>
    </div>
  );
}

export default function App() {
  return (
    <RealtimeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </RealtimeProvider>
  );
}
