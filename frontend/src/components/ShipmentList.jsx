// frontend/src/components/ShipmentList.jsx
import React, { useState } from 'react';
import { useShipments } from '../hook/useShipments';

const ShipmentList = () => {
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

  if (loading) return <div>Loading shipments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shipment-list">
      <h2>Shipments</h2>
      
      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Created">Created</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="shipments-table">
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
            </tr>
          </thead>
          <tbody>
            {shipments.map(shipment => (
              <tr key={shipment._id}>
                <td>{shipment.shipmentId}</td>
                <td>{shipment.productName}</td>
                <td>{shipment.origin}</td>
                <td>{shipment.destination}</td>
                <td>
                  <span className={`status status-${shipment.status.toLowerCase().replace(' ', '-')}`}>
                    {shipment.status}
                  </span>
                </td>
                <td>{shipment.customer?.slice(0, 10)}...</td>
                <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentList;