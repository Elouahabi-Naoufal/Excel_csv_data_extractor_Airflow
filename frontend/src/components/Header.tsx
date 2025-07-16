import React from 'react';
import './Header.css';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="enterprise-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="logo">
            <span className="bracket">{'{'}</span>
            <span className="company-name">EXPLEO</span>
            <span className="bracket">{'}'}</span>
          </div>
          <h1 className="app-title">Excel Data Explorer</h1>
        </div>
        
        <nav className="main-nav">
          <button 
            className={`nav-item ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => onNavigate('upload')}
          >
            Upload
          </button>
          <button 
            className={`nav-item ${currentView === 'tables' ? 'active' : ''}`}
            onClick={() => onNavigate('tables')}
          >
            Data Tables
          </button>
          <button 
            className={`nav-item ${currentView === 'compliance' ? 'active' : ''}`}
            onClick={() => onNavigate('compliance')}
          >
            Compliance
          </button>
          <button 
            className={`nav-item ${currentView === 'security' ? 'active' : ''}`}
            onClick={() => onNavigate('security')}
          >
            Security
          </button>
          <button 
            className={`nav-item ${currentView === 'help' ? 'active' : ''}`}
            onClick={() => onNavigate('help')}
          >
            Help
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;