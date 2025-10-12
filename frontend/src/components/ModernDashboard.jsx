import React, { useState, useEffect } from 'react';
import '../assets/styles/ModernDashboard.css';

const ModernDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setShipments([
        { id: 1, trackingNumber: 'SH001', status: 'In Transit', progress: 75, from: 'Hanoi', to: 'Ho Chi Minh City', estimatedDelivery: '2024-01-15' },
        { id: 2, trackingNumber: 'SH002', status: 'Delivered', progress: 100, from: 'Da Nang', to: 'Hanoi', estimatedDelivery: '2024-01-10' },
        { id: 3, trackingNumber: 'SH003', status: 'Processing', progress: 25, from: 'Ho Chi Minh City', to: 'Can Tho', estimatedDelivery: '2024-01-20' }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4caf50';
      case 'In Transit': return '#2196f3';
      case 'Processing': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✓';
      case 'In Transit': return '🚚';
      case 'Processing': return '⏳';
      default: return '📦';
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Header Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Shipments</h3>
            <div className="stat-number">24</div>
            <div className="stat-change positive">+12% from last month</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <div className="stat-number">8</div>
            <div className="stat-change positive">+3 this week</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <div className="stat-number">16</div>
            <div className="stat-change positive">98% success rate</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Avg. Delivery</h3>
            <div className="stat-number">2.3 days</div>
            <div className="stat-change negative">+0.2 days</div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="recent-shipments">
        <div className="section-header">
          <h2>Recent Shipments</h2>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="shipments-list">
          {shipments.map(shipment => (
            <div key={shipment.id} className="shipment-card">
              <div className="shipment-header">
                <div className="shipment-info">
                  <h3>{shipment.trackingNumber}</h3>
                  <p>{shipment.from} → {shipment.to}</p>
                </div>
                <div className="shipment-status" style={{ color: getStatusColor(shipment.status) }}>
                  <span className="status-icon">{getStatusIcon(shipment.status)}</span>
                  {shipment.status}
                </div>
              </div>
              
              <div className="shipment-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${shipment.progress}%`,
                      backgroundColor: getStatusColor(shipment.status)
                    }}
                  ></div>
                </div>
                <div className="progress-text">{shipment.progress}% Complete</div>
              </div>
              
              <div className="shipment-details">
                <div className="detail-item">
                  <span className="detail-label">Estimated Delivery:</span>
                  <span className="detail-value">{shipment.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <span className="action-icon">➕</span>
            Create Shipment
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">🔍</span>
            Track Package
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">📊</span>
            View Reports
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">⚙️</span>
            Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderShipments = () => (
    <div className="shipments-content">
      <div className="content-header">
        <h1>My Shipments</h1>
        <button className="create-shipment-btn">+ Create New Shipment</button>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select>
            <option>All</option>
            <option>Processing</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date Range:</label>
          <select>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>
      
      <div className="shipments-table">
        <div className="table-header">
          <div className="col-tracking">Tracking Number</div>
          <div className="col-route">Route</div>
          <div className="col-status">Status</div>
          <div className="col-progress">Progress</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {shipments.map(shipment => (
          <div key={shipment.id} className="table-row">
            <div className="col-tracking">
              <strong>{shipment.trackingNumber}</strong>
            </div>
            <div className="col-route">
              {shipment.from} → {shipment.to}
            </div>
            <div className="col-status">
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(shipment.status) }}
              >
                {getStatusIcon(shipment.status)} {shipment.status}
              </span>
            </div>
            <div className="col-progress">
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${shipment.progress}%`,
                      backgroundColor: getStatusColor(shipment.status)
                    }}
                  ></div>
                </div>
                <span className="progress-text">{shipment.progress}%</span>
              </div>
            </div>
            <div className="col-actions">
              <button className="action-btn-small">View</button>
              <button className="action-btn-small">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <h1>Analytics & Reports</h1>
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Shipment Trends</h3>
          <div className="chart-placeholder">
            <p>📈 Chart visualization would go here</p>
          </div>
        </div>
        <div className="chart-card">
          <h3>Delivery Performance</h3>
          <div className="chart-placeholder">
            <p>📊 Performance metrics would go here</p>
          </div>
        </div>
        <div className="chart-card">
          <h3>Route Analysis</h3>
          <div className="chart-placeholder">
            <p>🗺️ Route optimization data would go here</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚛</span>
            <h1>LogiChain</h1>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipments')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-label">My Shipments</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Analytics</span>
          </button>
          
          <button className="nav-item">
            <span className="nav-icon">🔍</span>
            <span className="nav-label">Track Package</span>
          </button>
          
          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'shipments' && 'My Shipments'}
              {activeTab === 'analytics' && 'Analytics'}
            </h1>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search shipments..." />
            </div>
            
            <div className="header-actions">
              <button className="notification-btn">🔔</button>
              <button className="message-btn">💬</button>
              
              <div className="user-profile">
                <div className="user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-role">Customer</div>
                </div>
                <button className="logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'shipments' && renderShipments()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;
