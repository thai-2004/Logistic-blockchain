import React, { useState } from 'react';
import { shipmentAPI } from '../services/api';

const CreateShipment = ({ user, onShipmentCreated }) => {
  const [formData, setFormData] = useState({
    productName: '',
    origin: '',
    destination: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        customer: user?.address || undefined
      };
      const response = await shipmentAPI.createShipment(payload);
      setSuccess(`Shipment created successfully! ID: ${response.data.shipment.shipmentId}`);
      
      // Reset form
      setFormData({
        productName: '',
        origin: '',
        destination: ''
      });
      
      // Call callback if provided
      if (onShipmentCreated) {
        onShipmentCreated(response.data.shipment);
      }
      
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // Gracefully handle duplicate shipment (409 Conflict)
      if (status === 409 && data) {
        const existing = data.existingShipment;
        const existingId = existing?.shipmentId;
        const message = data.message || data.error || 'Duplicate shipment';

        setSuccess(
          existingId
            ? `Shipment already exists. Using existing ID: ${existingId}`
            : message
        );

        // Bubble up the existing shipment so UI can proceed
        if (onShipmentCreated && existing) {
          onShipmentCreated(existing);
        }
        setError(null);
      } else {
        setError(data?.error || 'Failed to create shipment');
        console.error('Create shipment error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      origin: '',
      destination: ''
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="create-shipment">
      <div className="form-header">
        <h2>🚛 Tạo Shipment Mới</h2>
        <p className="form-subtitle">Tạo lô hàng mới trên blockchain</p>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="productName">Tên sản phẩm *</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="origin">Điểm xuất phát *</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Nhập điểm xuất phát"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">Điểm đến *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Nhập điểm đến"
            required
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={loading}
          >
            Reset
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Đang tạo...
              </>
            ) : (
              <>
                🚛 Tạo Shipment
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {success}
        </div>
      )}
    </div>
  );
};

export default CreateShipment;