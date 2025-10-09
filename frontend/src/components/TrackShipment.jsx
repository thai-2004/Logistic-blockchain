// frontend/src/components/TrackShipment.jsx
import React, { useState } from 'react';
// import { useShipment } from '../hooks/useShipments';
import { shipmentAPI } from '../services/api';

const TrackShipment = () => {
  const [shipmentId, setShipmentId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!shipmentId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await shipmentAPI.getShipmentTracking(shipmentId);
      setTrackingData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to track shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-shipment">
      <div className="track-header">
        <h2>🔍 Track Your Shipment</h2>
        <p className="track-subtitle">Enter your shipment ID to view real-time tracking information</p>
      </div>
      
      <form onSubmit={handleTrack} className="track-form">
        <div className="input-group">
          <input
            type="number"
            placeholder="Enter Shipment ID (e.g., 12345)"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            required
            className="track-input"
          />
          <button type="submit" disabled={loading} className="track-btn">
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Tracking...
              </>
            ) : (
              <>
                🔍 Track Shipment
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Tracking Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {trackingData && (
        <div className="tracking-result">
          <div className="result-header">
            <h3>📦 Shipment Details</h3>
            <div className="status-badge status-{trackingData.shipment.status.toLowerCase().replace(' ', '-')}">
              {trackingData.shipment.status}
            </div>
          </div>
          
          <div className="shipment-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">🆔 Shipment ID</span>
                <span className="info-value">#{trackingData.shipment.shipmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📦 Product</span>
                <span className="info-value">{trackingData.shipment.productName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🗺️ Route</span>
                <span className="info-value">{trackingData.shipment.origin} → {trackingData.shipment.destination}</span>
              </div>
              {trackingData.shipment.driverName && (
                <div className="info-item">
                  <span className="info-label">👨‍💼 Driver</span>
                  <span className="info-value">{trackingData.shipment.driverName}</span>
                </div>
              )}
              {trackingData.shipment.vehiclePlate && (
                <div className="info-item">
                  <span className="info-label">🚛 Vehicle</span>
                  <span className="info-value">{trackingData.shipment.vehiclePlate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="timeline-section">
            <h3>📅 Tracking Timeline</h3>
            <div className="timeline">
              {trackingData.timeline.map((event, index) => (
                <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
                  <div className="timeline-marker">
                    {event.completed ? '✅' : '⏳'}
                  </div>
                  <div className="timeline-content">
                    <h4>{event.status}</h4>
                    <p>{event.description}</p>
                    <small>{new Date(event.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;