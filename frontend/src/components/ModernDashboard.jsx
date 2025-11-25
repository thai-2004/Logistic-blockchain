import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import CreateShipment from '@components/CreateShipment';
import ShipmentList from '@components/ShipmentList';
import '../assets/styles/ModernDashboard.css';
import { useShipments } from '../hooks/useShipments';

const ModernDashboard = ({ user, onLogout, initialTab = 'dashboard', onRouteChange }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Memoize shipment params
  const shipmentParams = useMemo(() => 
    user && user.role !== 'Owner' ? { customer: user?.address, limit: 5 } : { limit: 5 },
    [user]
  );
  
  const { shipments, refetch: refetchShipments } = useShipments(shipmentParams);

  useEffect(() => {
    // refetch when user changes or refreshKey bumps
    refetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]);

  // Memoize status helpers
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Delivered': return '#4caf50';
      case 'In Transit': return '#2196f3';
      case 'Processing': return '#ff9800';
      default: return '#9e9e9e';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'Delivered': return '✓';
      case 'In Transit': return '🚚';
      case 'Processing': return '⏳';
      default: return '📦';
    }
  }, []);

  // Memoize computed stats
  const stats = useMemo(() => ({
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length
  }), [shipments]);

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Header Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Shipments</h3>
            <div className="stat-number">{stats.total}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <div className="stat-number">{stats.inTransit}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <div className="stat-number">{stats.delivered}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Avg. Delivery</h3>
            <div className="stat-number">-</div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="recent-shipments">
        <div className="section-header">
          <h2>Recent Shipments</h2>
          <button className="view-all-btn" onClick={() => handleTabChange('shipments')}>View All</button>
        </div>
        
        <div className="shipments-list">
          {shipments.length === 0 ? (
            <div className="shipment-card">
              <div className="shipment-header">
                <div className="shipment-info">
                  <h3>No shipments yet</h3>
                  <p>Create or track shipments to see them here</p>
                </div>
              </div>
            </div>
          ) : (
            shipments.map(shipment => (
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
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary" onClick={() => handleTabChange('create')}>
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
        <button
          className="create-shipment-btn"
          onClick={() => {
            handleTabChange('create');
          }}
        >
          + Create New Shipment
        </button>
      </div>
      <ShipmentList user={user} key={refreshKey} />
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

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (onRouteChange) {
      onRouteChange(tab);
    }
  }, [onRouteChange]);

  const handleShipmentCreated = useCallback(() => {
    setActiveTab('shipments');
    setRefreshKey((k) => k + 1);
    if (onRouteChange) {
      onRouteChange('shipments');
    }
  }, [onRouteChange]);

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
            onClick={() => handleTabChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => handleTabChange('shipments')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-label">My Shipments</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleTabChange('analytics')}
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
              </div>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content">
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'shipments' && renderShipments()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'create' && (
              <CreateShipment 
                user={user}
                onShipmentCreated={handleShipmentCreated}
              />
            )}
          </>
        </main>
      </div>
    </div>
  );
};

ModernDashboard.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(['dashboard', 'shipments', 'create', 'analytics']),
  onRouteChange: PropTypes.func.isRequired,
};

export default memo(ModernDashboard);
