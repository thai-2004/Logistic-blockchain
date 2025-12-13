import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import CreateShipment from '@components/CreateShipment';
import { useShipments } from '@hooks/useShipments';
import DashboardLayout from '@features/dashboard/layout/DashboardLayout';
import DashboardHome from '@features/dashboard/pages/DashboardHome';
import ShipmentsPage from '@features/dashboard/pages/ShipmentsPage';
import AnalyticsPage from '@features/dashboard/pages/AnalyticsPage';
import TrackPage from '@features/dashboard/pages/TrackPage';
import SettingsPage from '@features/dashboard/pages/SettingsPage';

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

  // Redirect Customer away from restricted tabs
  useEffect(() => {
    if (user?.role === 'Customer' && (activeTab === 'analytics' || activeTab === 'track')) {
      setActiveTab('dashboard');
      if (onRouteChange) {
        onRouteChange('dashboard');
      }
    }
  }, [user, activeTab, onRouteChange]);

  const handleTabChange = useCallback((tab) => {
    // Prevent Customer from accessing restricted tabs
    if (user?.role === 'Customer' && (tab === 'analytics' || tab === 'track')) {
      return;
    }
    setActiveTab(tab);
    if (onRouteChange) {
      onRouteChange(tab);
    }
  }, [onRouteChange, user]);

  const handleShipmentCreated = useCallback(() => {
    setActiveTab('shipments');
    setRefreshKey((k) => k + 1);
    if (onRouteChange) {
      onRouteChange('shipments');
    }
  }, [onRouteChange]);

  const handleUpdateShipment = useCallback((shipmentId) => {
    // For Owner, navigate to update tab if available
    // For Customer, show info that they can track the shipment
    if (user?.role === 'Owner') {
      // Could navigate to update tab or show modal
      // For now, just show info - can be extended later
      setActiveTab('track');
      if (onRouteChange) {
        onRouteChange('track');
      }
    }
  }, [user, onRouteChange]);

  return (
    <DashboardLayout
      user={user}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={onLogout}
    >
      {activeTab === 'dashboard' && (
        <DashboardHome shipments={shipments} onTabChange={handleTabChange} />
      )}
      {activeTab === 'shipments' && (
        <ShipmentsPage 
          user={user} 
          refreshKey={refreshKey} 
          onCreate={() => handleTabChange('create')}
          onUpdateShipment={handleUpdateShipment}
        />
      )}
      {activeTab === 'analytics' && user?.role === 'Owner' && <AnalyticsPage />}
      {activeTab === 'create' && (
        <CreateShipment
          user={user}
          onShipmentCreated={handleShipmentCreated}
        />
      )}
      {activeTab === 'track' && user?.role === 'Owner' && <TrackPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </DashboardLayout>
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
