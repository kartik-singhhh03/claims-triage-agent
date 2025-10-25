import { useState } from 'react';
import './Sidebar.css';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Claims', path: '/claims', icon: '📋' },
  { label: 'Queues', path: '/queues', icon: '📦' },
  { label: 'Rules', path: '/rules', icon: '⚙️' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

export default function Sidebar({
  currentPath = '/dashboard',
  onNavigate,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState(currentPath);

  const handleNavClick = (path: string) => {
    setActiveTab(path);
    if (onNavigate) {
      onNavigate(path);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {!isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <button
                  className={`nav-link ${activeTab === item.path ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {activeTab === item.path && (
                    <span className="nav-indicator"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="help-btn" title="Help & Support">
            ❓
          </button>
        </div>
      </aside>
    </>
  );
}
