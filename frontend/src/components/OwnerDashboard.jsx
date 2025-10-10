import React, { useState } from 'react';
import Dashboard from './Dashboard';
import TrackShipment from './TrackShipment';
import CreateShipment from './CreateShipment';
import UpdateShipment from './UpdateShipment';
import ShipmentList from './ShipmentList';
import ShipperPanel from './ShipperPanel';
import LiveCheckpointMap from './LiveCheckpointMap';
import '../assets/OwnerDashboard.css';

const OwnerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Tạo Shipment', icon: '➕' },
    { id: 'list', label: 'Danh sách', icon: '📋' },
    { id: 'track', label: 'Theo dõi', icon: '🔍' },
    { id: 'update', label: 'Cập nhật', icon: '✏️' },
    { id: 'shipper', label: 'Shipper Panel', icon: '🚚' },
    { id: 'map', label: 'Bản đồ', icon: '🗺️' }
  ];

  return (
    <div className="owner-dashboard">
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
            <span className="user-name">👑 {user.name}</span>
            <span className="user-role">Chủ sở hữu</span>
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
            <p>Bạn có quyền truy cập đầy đủ vào hệ thống quản lý logistics</p>
            <div className="admin-badges">
              <span className="admin-badge">🔧 Quản trị viên</span>
              <span className="admin-badge">📊 Báo cáo đầy đủ</span>
              <span className="admin-badge">👥 Quản lý người dùng</span>
            </div>
          </div>
          
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'create' && <CreateShipment />}
          {activeTab === 'list' && <ShipmentList />}
          {activeTab === 'track' && <TrackShipment />}
          {activeTab === 'update' && <UpdateShipment />}
          {activeTab === 'shipper' && <ShipperPanel />}
          {activeTab === 'map' && <LiveCheckpointMap />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Logistics Blockchain. Built with React & Solidity.</p>
          <div className="footer-links">
            <span>🔗 Ethereum Network</span>
            <span>⚡ Real-time Updates</span>
            <span>🔒 Secure & Transparent</span>
            <span>👑 Admin Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
