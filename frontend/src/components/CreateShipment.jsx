// frontend/src/components/CreateShipment.jsx
import React, { useState, useEffect } from 'react';
import { shipmentAPI } from '../services/api';

const ShipmentStats = () => {
  const [totalShipments, setTotalShipments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShipmentStats();
  }, []);

  const fetchShipmentStats = async () => {
    try {
      setLoading(true);
      const response = await shipmentAPI.getAllShipments();
      setTotalShipments(response.data.length);
    } catch (err) {
      setError('Không thể tải thống kê lô hàng');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchShipmentStats();
  };

  return (
    <div className="shipment-stats">
      <h2>Thống Kê Lô Hàng</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">
            {loading ? 'Đang tải...' : totalShipments}
          </div>
          <div className="stat-label">Tổng Số Lô Hàng</div>
        </div>
        
        <button 
          className="refresh-btn" 
          onClick={refreshStats}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Làm Mới'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ShipmentStats;