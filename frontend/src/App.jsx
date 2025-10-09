// frontend/src/App.jsx
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TrackShipment from './components/TrackShipment';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'track', label: 'Track Shipment', icon: '🔍' }
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">🚛</span>
            <h1>Logistics Blockchain</h1>
          </div>
          <div className="navbar-subtitle">
            <span className="blockchain-badge">🔗 Blockchain Powered</span>
          </div>
        </div>
        
        <div className="nav-tabs">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'track' && <TrackShipment />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Logistics Blockchain. Built with React & Solidity.</p>
          <div className="footer-links">
            <span>🔗 Ethereum Network</span>
            <span>⚡ Real-time Updates</span>
            <span>🔒 Secure & Transparent</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;