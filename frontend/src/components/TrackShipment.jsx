// frontend/src/components/TrackShipment.jsx
import React, { useState } from 'react';
import { useShipment } from '../hook/useShipments';
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
      <h2>Track Shipment</h2>
      <form onSubmit={handleTrack}>
        <input
          type="number"
          placeholder="Enter Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {trackingData && (
        <div className="tracking-result">
          <h3>Shipment Details</h3>
          <div className="shipment-info">
            <p><strong>ID:</strong> {trackingData.shipment.shipmentId}</p>
            <p><strong>Product:</strong> {trackingData.shipment.productName}</p>
            <p><strong>Route:</strong> {trackingData.shipment.origin} → {trackingData.shipment.destination}</p>
            <p><strong>Status:</strong> {trackingData.shipment.status}</p>
            {trackingData.shipment.driverName && (
              <p><strong>Driver:</strong> {trackingData.shipment.driverName}</p>
            )}
            {trackingData.shipment.vehiclePlate && (
              <p><strong>Vehicle:</strong> {trackingData.shipment.vehiclePlate}</p>
            )}
          </div>

          <h3>Timeline</h3>
          <div className="timeline">
            {trackingData.timeline.map((event, index) => (
              <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{event.status}</h4>
                  <p>{event.description}</p>
                  <small>{new Date(event.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;