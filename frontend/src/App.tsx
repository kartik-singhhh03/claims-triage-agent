import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LayoutContainer from './components/layout/LayoutContainer';
import DashboardPage from './pages/DashboardPage';
import ClaimsPage from './pages/ClaimsPage';
import QueuesPage from './pages/QueuesPage';
import RulesPage from './pages/RulesPage';
import './App.css';

type PagePath = '/dashboard' | '/claims' | '/queues' | '/rules' | '/settings' | '/';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PagePath>('/');
  const [isRealtimeConnected] = useState(true);

  const handleNavigate = (path: string) => {
    setCurrentPage(path as PagePath);
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
        return <DashboardPage />;
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
