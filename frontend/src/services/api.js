// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shipment APIs
export const shipmentAPI = {
  // Get all shipments
  getAllShipments: (params = {}) => api.get('/shipments', { params }),
  
  // Get shipment by ID
  getShipment: (id) => api.get(`/shipments/${id}`),
  
  // Create shipment
  createShipment: (data) => api.post('/shipments', data),
  
  // Update shipment
  updateShipment: (id, data) => api.put(`/shipments/${id}/status`, data),
  
  // Delete shipment
  deleteShipment: (id) => api.delete(`/shipments/${id}`),
  
  // Get shipment statistics
  getStats: (period = 'all') => api.get('/shipments/stats', { params: { period } }),
  
  // Search shipments
  searchShipments: (params) => api.get('/shipments/search', { params }),
  
  // Get shipments by customer
  getShipmentsByCustomer: (customer, params = {}) => 
    api.get(`/shipments/customer/${customer}`, { params }),
  
  // Get shipments by status
  getShipmentsByStatus: (status, params = {}) => 
    api.get(`/shipments/status/${status}`, { params }),
  
  // Get shipment tracking
  getShipmentTracking: (id) => api.get(`/shipments/${id}/tracking`),
  
  // Get shipment count
  getShipmentCount: () => api.get('/shipments/count')
};

export default api;