import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './LayoutContainer.css';

interface LayoutContainerProps {
  children?: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onSearchSubmit?: (query: string) => void;
  isRealtimeConnected?: boolean;
}

export default function LayoutContainer({
  children,
  currentPath = '/dashboard',
  onNavigate,
  onSearchSubmit,
  isRealtimeConnected = true,
}: LayoutContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout-container">
      <Header
        onSearchSubmit={onSearchSubmit}
        onMenuToggle={handleMenuToggle}
        isRealtimeConnected={isRealtimeConnected}
      />
      <div className="layout-wrapper">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />
        <main className="main-content-area">{children}</main>
      </div>
    </div>
  );
}
