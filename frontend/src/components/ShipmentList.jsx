import React, { useState } from 'react';
import { useShipments } from '../hooks/useShipments';

const ShipmentList = ({ onUpdateShipment }) => {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  const { shipments, loading, error, pagination, refetch } = useShipments(filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading shipments...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>Error: {error}</p>
      <button onClick={() => refetch()} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="shipment-list">
      <div className="list-header">
        <h2>Shipments</h2>
        <button onClick={() => refetch()} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
      
      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="Created">Created</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Items per page:</label>
          <select 
            value={filters.limit} 
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="filter-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="shipments-table">
        {shipments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No shipments found</h3>
            <p>Create your first shipment to get started!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (
                <tr key={shipment._id} className="shipment-row">
                  <td className="shipment-id">#{shipment.shipmentId}</td>
                  <td className="product-name">{shipment.productName}</td>
                  <td className="origin">{shipment.origin}</td>
                  <td className="destination">{shipment.destination}</td>
                  <td>
                    <span className={`status status-${shipment.status.toLowerCase().replace(' ', '-')}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="customer">{shipment.customer?.slice(0, 10)}...</td>
                  <td className="created-date">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="action-btn view-btn" title="View Details">
                      👁️
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      title="Edit"
                      onClick={() => onUpdateShipment && onUpdateShipment(shipment.shipmentId)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="pagination-btn prev-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <span className="total-items">
              ({pagination.totalItems} total items)
            </span>
          </div>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="pagination-btn next-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentList;