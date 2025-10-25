import { useState } from 'react';
import './Header.css';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
  onMenuToggle?: () => void;
  isRealtimeConnected?: boolean;
}

export default function Header({
  onSearchSubmit,
  onMenuToggle,
  isRealtimeConnected = true,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="header-brand">
          <h2 className="app-title">ClaimWise</h2>
        </div>
      </div>

      <form className="header-search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search claims..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn" aria-label="Search">
          🔍
        </button>
      </form>

      <div className="header-right">
        <div
          className={`realtime-indicator ${
            isRealtimeConnected ? 'connected' : 'disconnected'
          }`}
          title={isRealtimeConnected ? 'Connected' : 'Disconnected'}
        >
          <span className="realtime-dot"></span>
          <span className="realtime-text">
            {isRealtimeConnected ? 'Live' : 'Offline'}
          </span>
        </div>

        <div className="user-profile-container">
          <button
            className="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User profile menu"
          >
            <div className="user-avatar">U</div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown-menu">
              <a href="#" className="dropdown-item">
                Profile
              </a>
              <a href="#" className="dropdown-item">
                Settings
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item logout-item">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
