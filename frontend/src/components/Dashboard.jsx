// frontend/src/components/Dashboard.jsx
import React, { useState } from 'react';
import ShipmentList from './ShipmentList';
import CreateShipment from './CreateShipment';
import UpdateShipment from './UpdateShipment';

const Dashboard = () => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
      <h1>Logistics Blockchain Dashboard</h1>
      
      {/* Create Shipment Form */}
      <CreateShipment />

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