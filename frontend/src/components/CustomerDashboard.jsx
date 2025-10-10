import React, { useState } from 'react';
import TrackShipment from './TrackShipment';
import '../assets/CustomerDashboard.css';

const CustomerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('track');

  const navItems = [
    { id: 'track', label: 'Theo dõi Shipment', icon: '🔍' }
  ];

  return (
    <div className="customer-dashboard">
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

        <div className="user-info">
          <div className="user-details">
            <span className="user-name">👤 {user.name}</span>
            <span className="user-role">Khách hàng</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="welcome-section">
            <h2>Chào mừng, {user.name}!</h2>
            <p>Bạn có thể theo dõi các shipment của mình tại đây</p>
          </div>
          
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
};

export default CustomerDashboard;
