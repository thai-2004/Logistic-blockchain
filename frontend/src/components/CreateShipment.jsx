// frontend/src/components/CreateShipment.jsx
import React, { useState } from 'react';
import { shipmentAPI } from '../services/api';

const CreateShipment = ({ onShipmentCreated }) => {
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
      const response = await shipmentAPI.createShipment(formData);
      setSuccess('Shipment created successfully!');
      setFormData({ productName: '', origin: '', destination: '' });
      if (onShipmentCreated) {
        onShipmentCreated(response.data.shipment);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-shipment">
      <h2>Create New Shipment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Origin:</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Shipment'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default CreateShipment;