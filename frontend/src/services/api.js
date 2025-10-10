// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Account APIs
export const accountAPI = {
  // Get all accounts with pagination and filters
  getAllAccounts: (params = {}) => api.get('/accounts', { params }),
  
  // Get account by ID
  getAccount: (id) => api.get(`/accounts/${id}`),
  
  // Get account by address
  getAccountByAddress: (address) => api.get(`/accounts/address/${address}`),
  
  // Get accounts by role
  getAccountsByRole: (role, params = {}) => 
    api.get(`/accounts/role/${role}`, { params }),
  
  // Create account
  createAccount: (data) => api.post('/accounts', data),
  
  // Update account
  updateAccount: (id, data) => api.put(`/accounts/${id}`, data),
  
  // Toggle account status (activate/deactivate)
  toggleAccountStatus: (id, data) => api.patch(`/accounts/${id}/status`, data),
  
  // Delete account (soft delete)
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
  
  // Get account statistics
  getStats: () => api.get('/accounts/stats'),
  
  // Check if account exists by address
  checkAccountExists: (address) => api.get(`/accounts/check/${address}`),
  
  // Check if account exists by email
  checkAccountByEmail: (email) => api.get(`/accounts/check-email/${email}`),
  
  // Login
  login: (data) => api.post('/accounts/login', data)
};

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
  getShipmentCount: () => api.get('/shipments/count'),
  
  // Cleanup duplicate shipments
  cleanupDuplicates: () => api.post('/shipments/cleanup-duplicates')
};

export default api;