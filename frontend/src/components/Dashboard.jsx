// frontend/src/components/Dashboard.jsx
import React from 'react';
import { useShipmentStats } from '../hook/useShipments';
import ShipmentList from './ShipmentList';
import CreateShipment from './CreateShipment';

const Dashboard = () => {
  const { stats, loading: statsLoading, error: statsError } = useShipmentStats('all');

  return (
    <div className="dashboard">
      <h1>Logistics Blockchain Dashboard</h1>
      
      {/* Statistics */}
      <div className="stats-section">
        <h2>Statistics</h2>
        {statsLoading && <div>Loading statistics...</div>}
        {statsError && <div>Error loading stats: {statsError}</div>}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Shipments</h3>
              <p>{stats.totalShipments}</p>
            </div>
            <div className="stat-card">
              <h3>Created</h3>
              <p>{stats.statusStats.Created}</p>
            </div>
            <div className="stat-card">
              <h3>In Transit</h3>
              <p>{stats.statusStats['In Transit']}</p>
            </div>
            <div className="stat-card">
              <h3>Delivered</h3>
              <p>{stats.statusStats.Delivered}</p>
            </div>
            <div className="stat-card">
              <h3>Cancelled</h3>
              <p>{stats.statusStats.Cancelled}</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Shipment */}
      <CreateShipment />

      {/* Shipments List */}
      <ShipmentList />
    </div>
  );
};

export default Dashboard;