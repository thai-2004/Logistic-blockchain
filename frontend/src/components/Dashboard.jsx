// frontend/src/components/Dashboard.jsx
import React, { useState } from 'react';
import { useShipmentStats } from '../hook/useShipments';
import ShipmentList from './ShipmentList';
import CreateShipment from './CreateShipment';
import UpdateShipment from './UpdateShipment';

const Dashboard = () => {
  const { stats, loading: statsLoading, error: statsError } = useShipmentStats('all');
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleShipmentCreated = () => {
    // Refresh stats and list when new shipment is created
    window.location.reload(); // Simple refresh for now
  };

  const handleUpdateShipment = (shipmentId) => {
    setSelectedShipmentId(shipmentId);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedShipmentId(null);
  };

  const handleShipmentUpdated = () => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <h1>🚛 Logistics Blockchain Dashboard</h1>
      
      {/* Statistics */}
      <div className="stats-section">
        <h2>📊 Real-time Statistics</h2>
        {statsLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading statistics...</p>
          </div>
        )}
        {statsError && (
          <div className="error">
            ⚠️ Error loading stats: {statsError}
          </div>
        )}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📦 Total Shipments</h3>
              <p>{stats.totalShipments}</p>
            </div>
            <div className="stat-card">
              <h3>🆕 Created</h3>
              <p>{stats.statusStats.Created}</p>
            </div>
            <div className="stat-card">
              <h3>🚚 In Transit</h3>
              <p>{stats.statusStats['In Transit']}</p>
            </div>
            <div className="stat-card">
              <h3>✅ Delivered</h3>
              <p>{stats.statusStats.Delivered}</p>
            </div>
            <div className="stat-card">
              <h3>❌ Cancelled</h3>
              <p>{stats.statusStats.Cancelled}</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Shipment */}
      <CreateShipment onShipmentCreated={handleShipmentCreated} />

      {/* Shipments List */}
      <ShipmentList onUpdateShipment={handleUpdateShipment} />

      {/* Update Shipment Modal */}
      {showUpdateModal && selectedShipmentId && (
        <UpdateShipment
          shipmentId={selectedShipmentId}
          onUpdate={handleShipmentUpdated}
          onClose={handleCloseUpdateModal}
        />
      )}
    </div>
  );
};

export default Dashboard;