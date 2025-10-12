import React, { useState, useEffect } from 'react';
import { shipmentAPI } from '../services/api';

const UpdateShipment = ({ shipmentId, onUpdate, onClose }) => {
  const [searchId, setSearchId] = useState(shipmentId || '');
  const [shipmentData, setShipmentData] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    driverName: '',
    vehiclePlate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const statusOptions = [
    { value: 'Created', label: 'Created' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (shipmentId) {
      setSearchId(shipmentId);
      fetchShipmentDetails(shipmentId);
    }
  }, [shipmentId]);

  const fetchShipmentDetails = async (id) => {
    if (!id) return;
    
    try {
      setSearchLoading(true);
      setError(null);
      const response = await shipmentAPI.getShipment(id);
      const shipment = response.data.shipment;
      
      setShipmentData(shipment);
      setFormData({
        status: shipment.status || '',
        driverName: shipment.driverName || '',
        vehiclePlate: shipment.vehiclePlate || '',
        notes: shipment.notes || ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Không tìm thấy shipment');
      setShipmentData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      fetchShipmentDetails(searchId);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shipmentData) {
      setError('Vui lòng tìm shipment trước khi cập nhật');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await shipmentAPI.updateShipment(shipmentData.shipmentId, formData);
      setSuccess('Shipment updated successfully!');
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
      
      // Auto close after 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className="update-shipment-modal">
      <div className="modal-overlay" onClick={handleCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cập nhật Shipment</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="searchId">Tìm Shipment ID</label>
              <div className="search-input-group">
                <input
                  type="number"
                  id="searchId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Nhập Shipment ID"
                  className="form-input"
                  required
                />
                <button 
                  type="submit" 
                  disabled={searchLoading}
                  className="search-btn"
                >
                  {searchLoading ? 'Đang tìm...' : '🔍 Tìm'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Shipment Info */}
        {shipmentData && (
          <div className="shipment-info">
            <h3>Thông tin Shipment</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID:</span>
                <span className="info-value">#{shipmentData.shipmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sản phẩm:</span>
                <span className="info-value">{shipmentData.productName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Từ:</span>
                <span className="info-value">{shipmentData.origin}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Đến:</span>
                <span className="info-value">{shipmentData.destination}</span>
              </div>
            </div>
          </div>
        )}

        {/* Update Form */}
        {shipmentData && (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label htmlFor="status">Trạng thái *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Chọn trạng thái</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="driverName">Tên tài xế</label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Nhập tên tài xế"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehiclePlate">Biển số xe</label>
              <input
                type="text"
                id="vehiclePlate"
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                placeholder="Nhập biển số xe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Ghi chú</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Thêm ghi chú..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật Shipment'}
              </button>
            </div>
          </form>
        )}

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
};

export default UpdateShipment;
