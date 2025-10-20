import React, { useState, useEffect } from 'react';
import Dashboard from '@components/Dashboard';
import TrackShipment from '@components/TrackShipment';
import CreateShipment from '@components/CreateShipment';
import UpdateShipment from '@components/UpdateShipment';
import ShipmentList from '@components/ShipmentList';
import ShipperPanel from '@components/ShipperPanel';
import LiveCheckpointMap from '@components/LiveCheckpointMap';
import { shipmentAPI } from '../services/api';
import '../assets/styles/ModernOwnerDashboard.css';

const OwnerDashboard = ({ user, onLogout, initialTab = 'dashboard', onRouteChange }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentShipments: [],
    loading: true,
    error: null
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#3B82F6' },
    { id: 'create', label: 'Tạo Shipment', icon: '➕', color: '#10B981' },
    { id: 'list', label: 'Danh sách', icon: '📋', color: '#8B5CF6' },
    { id: 'track', label: 'Theo dõi', icon: '🔍', color: '#F59E0B' },
    { id: 'update', label: 'Cập nhật', icon: '✏️', color: '#EF4444' },
    { id: 'shipper', label: 'Shipper Panel', icon: '🚚', color: '#06B6D4' },
    { id: 'map', label: 'Bản đồ', icon: '🗺️', color: '#84CC16' }
  ];

  // Fetch dashboard data from API
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch stats and recent shipments in parallel
      const [statsResponse, shipmentsResponse] = await Promise.all([
        shipmentAPI.getStats('all'),
        shipmentAPI.getAllShipments({ limit: 5 })
      ]);

      const stats = statsResponse.data.stats;
      const recentShipments = shipmentsResponse.data.shipments || [];

      setDashboardData({
        stats,
        recentShipments,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Không thể tải dữ liệu dashboard'
      }));
    }
  };

  const handleShipmentCreated = () => {
    // Refresh dashboard data when new shipment is created
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return '#10B981';
      case 'Đang vận chuyển': return '#F59E0B';
      case 'Đang xử lý': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="modern-owner-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚛</span>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h2>Logistics</h2>
                <span className="logo-subtitle">Blockchain</span>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (onRouteChange) {
                  onRouteChange(item.id);
                }
              }}
              style={{ '--item-color': item.color }}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">👑</div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">Chủ sở hữu</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' ? 'Tổng quan hệ thống logistics' : 'Quản lý và theo dõi shipments'}
            </p>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Tìm kiếm shipments..." />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="notifications">
              <button className="notification-btn">
                <span className="notification-icon">🔔</span>
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              {dashboardData.loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : dashboardData.error ? (
                <div className="error-container">
                  <div className="error-icon">⚠️</div>
                  <p>{dashboardData.error}</p>
                  <button onClick={fetchDashboardData} className="retry-btn">
                    Thử lại
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="stats-grid">
                    <div className="stat-card" style={{ '--card-color': '#3B82F6' }}>
                      <div className="stat-icon">📦</div>
                      <div className="stat-content">
                        <div className="stat-value">{dashboardData.stats?.totalShipments || 0}</div>
                        <div className="stat-label">Tổng Shipments</div>
                        <div className="stat-change positive">+12%</div>
                      </div>
                    </div>
                    
                    <div className="stat-card" style={{ '--card-color': '#F59E0B' }}>
                      <div className="stat-icon">🚛</div>
                      <div className="stat-content">
                        <div className="stat-value">{dashboardData.stats?.statusStats?.['In Transit'] || 0}</div>
                        <div className="stat-label">Đang vận chuyển</div>
                        <div className="stat-change positive">+5%</div>
                      </div>
                    </div>
                    
                    <div className="stat-card" style={{ '--card-color': '#10B981' }}>
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-value">{dashboardData.stats?.statusStats?.['Delivered'] || 0}</div>
                        <div className="stat-label">Hoàn thành</div>
                        <div className="stat-change positive">+18%</div>
                      </div>
                    </div>
                    
                    <div className="stat-card" style={{ '--card-color': '#8B5CF6' }}>
                      <div className="stat-icon">💰</div>
                      <div className="stat-content">
                        <div className="stat-value">${(dashboardData.stats?.totalShipments * 50 || 0).toLocaleString()}</div>
                        <div className="stat-label">Doanh thu ước tính</div>
                        <div className="stat-change positive">+23%</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Shipments */}
                  <div className="recent-shipments">
                    <div className="section-header">
                      <h3>Shipments gần đây</h3>
                      <button 
                        className="view-all-btn"
                        onClick={() => setActiveTab('list')}
                      >
                        Xem tất cả
                      </button>
                    </div>
                    <div className="shipments-list">
                      {dashboardData.recentShipments.length > 0 ? (
                        dashboardData.recentShipments.map((shipment, index) => (
                          <div key={index} className="shipment-card">
                            <div className="shipment-header">
                              <div className="shipment-id">#{shipment.shipmentId}</div>
                              <div 
                                className="shipment-status"
                                style={{ backgroundColor: getStatusColor(shipment.status) }}
                              >
                                {shipment.status}
                              </div>
                            </div>
                            <div className="shipment-route">
                              <span className="route-from">{shipment.origin}</span>
                              <span className="route-arrow">→</span>
                              <span className="route-to">{shipment.destination}</span>
                            </div>
                            <div className="shipment-product">
                              <span className="product-icon">📦</span>
                              <span className="product-name">{shipment.productName}</span>
                            </div>
                            <div className="shipment-customer">
                              <span className="customer-icon">👤</span>
                              <span className="customer-name">{shipment.customer?.slice(0, 10)}...</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <div className="empty-icon">📦</div>
                          <p>Chưa có shipments nào</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions">
                    <h3>Thao tác nhanh</h3>
                    <div className="actions-grid">
                      <button 
                        className="action-btn primary"
                        onClick={() => setActiveTab('create')}
                      >
                        <span className="action-icon">➕</span>
                        <span className="action-label">Tạo Shipment</span>
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => setActiveTab('list')}
                      >
                        <span className="action-icon">📊</span>
                        <span className="action-label">Xem Báo cáo</span>
                      </button>
                      <button 
                        className="action-btn tertiary"
                        onClick={() => setActiveTab('track')}
                      >
                        <span className="action-icon">🔍</span>
                        <span className="action-label">Theo dõi</span>
                      </button>
                      <button 
                        className="action-btn quaternary"
                        onClick={() => setActiveTab('update')}
                      >
                        <span className="action-icon">✏️</span>
                        <span className="action-label">Cập nhật</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'create' && <CreateShipment onShipmentCreated={handleShipmentCreated} />}
          {activeTab === 'list' && <ShipmentList />}
          {activeTab === 'track' && <TrackShipment />}
          {activeTab === 'update' && <UpdateShipment onUpdate={() => fetchDashboardData()} />}
          {activeTab === 'shipper' && <ShipperPanel />}
          {activeTab === 'map' && <LiveCheckpointMap />}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
