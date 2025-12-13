import React, { useEffect, useMemo, useState } from 'react';
import { useShipments } from '@hooks/useShipments';
import { getStatusColor, getStatusIcon } from '@shared/constants/status';
import { CircleCheckBig, Truck, Loader2, Package, Eye, Pencil, RefreshCw, X, MapPin, User, Hash, Calendar, AlertCircle } from 'lucide-react';
import { useShipment } from '@hooks/useShipments';
import { useToast } from '@contexts/ToastContext';

const ShipmentList = ({ user, onUpdateShipment, onViewShipment }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const toast = useToast();
  const [filters, setFilters] = useState(() => {
    const base = { status: '', page: 1, limit: 10 };
    if (user && user.role !== 'Owner') {
      return { ...base, customer: user.address };
    }
    return base;
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const base = { status: '', page: 1, limit: 10 };
    if (user && user.role !== 'Owner') {
      setFilters(() => ({ ...base, customer: user.address }));
    } else {
      setFilters(() => base);
    }
  }, [user]);

  const { shipments, loading, error, pagination, refetch } = useShipments(filters);
  const { shipment: selectedShipment, loading: shipmentLoading } = useShipment(selectedShipmentId);

  const visibleShipments = useMemo(() => {
    if (!search) return shipments;
    const q = search.toLowerCase();
    return shipments.filter((s) => {
      return (
        s.productName?.toLowerCase().includes(q) ||
        s.origin?.toLowerCase().includes(q) ||
        s.destination?.toLowerCase().includes(q) ||
        s.customer?.toLowerCase().includes(q) ||
        String(s.shipmentId || '').includes(q)
      );
    });
  }, [shipments, search]);

  const shortAddress = (addr) => {
    if (!addr) return '—';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CircleCheckBig className="h-4 w-4" />;
      case 'In Transit':
        return <Truck className="h-4 w-4" />;
      case 'Processing':
      case 'Created':
        return <Loader2 className="h-4 w-4 animate-spin-slow" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

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

  const handleViewShipment = (shipmentId) => {
    setSelectedShipmentId(shipmentId);
    setShowViewModal(true);
  };

  const handleEditShipment = (shipmentId) => {
    if (onUpdateShipment) {
      onUpdateShipment(shipmentId);
    } else {
      toast.info('Chức năng cập nhật sẽ được mở trong tab Update');
    }
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedShipmentId(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-200">
      <div className="h-10 w-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400">Loading shipments...</p>
    </div>
  );
  
  if (error) return (
    <div className="card-panel p-6 text-center space-y-3">
      <div className="text-3xl">⚠️</div>
      <p className="text-slate-200">Error: {error}</p>
      <button onClick={() => refetch()} className="btn-primary px-4 py-2">Retry</button>
    </div>
  );

  return (
    <div className="shipment-list space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">Logistics on-chain</p>
          <h2 className="text-xl font-bold text-slate-50">Shipments</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="btn-ghost">
            <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card-panel p-4 space-y-3">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-200">Search</label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-border bg-slate-900">
            <span className="text-brand-primary">🔍</span>
            <input
              type="text"
              placeholder="Search by product, route, customer, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500 w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-2 min-w-[180px]">
            <label className="text-sm font-semibold text-slate-200">Status Filter</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="">All Status</option>
              <option value="Created">Created</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[160px]">
            <label className="text-sm font-semibold text-slate-200">Items per page</label>
            <select 
              value={filters.limit} 
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="shipments-table card-panel p-0 overflow-hidden">
        {visibleShipments.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="text-3xl">📦</div>
            <h3 className="text-lg font-semibold text-slate-100">No shipments found</h3>
            <p className="text-slate-400 text-sm">Create your first shipment to get started!</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-slate-900/70 border-b border-brand-border">
              <tr className="text-left text-slate-300 text-sm">
                {(!user || user.role === 'Owner') ? <th className="px-4 py-3">ID</th> : null}
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleShipments.map(shipment => (
                <tr key={shipment._id} className="border-b border-brand-border/60 hover:bg-slate-900/60 transition">
                  {(!user || user.role === 'Owner') ? (
                    <td className="px-4 py-3 text-slate-200 font-semibold">#{shipment.shipmentId}</td>
                  ) : null}
                  <td className="px-4 py-3 font-semibold text-slate-100">{shipment.productName}</td>
                  <td className="px-4 py-3 text-slate-300">{shipment.origin}</td>
                  <td className="px-4 py-3 text-slate-300">{shipment.destination}</td>
                  <td className="px-4 py-3">
                    <span
                      className="status-chip"
                      style={{ backgroundColor: `${getStatusColor(shipment.status)}20`, color: getStatusColor(shipment.status) }}
                    >
                      <span className="status-icon">{statusIcon(shipment.status)}</span>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 customer">{shortAddress(shipment.customer)}</td>
                  <td className="px-4 py-3 text-slate-300">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button 
                      onClick={() => handleViewShipment(shipment.shipmentId)}
                      className="h-9 w-9 rounded-lg border border-brand-border bg-slate-900 hover:border-[#f3ba2f] hover:bg-[#f3ba2f]/10 flex items-center justify-center transition-all" 
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-slate-200 hover:text-[#f3ba2f]" />
                    </button>
                    <button 
                      onClick={() => handleEditShipment(shipment.shipmentId)}
                      className="h-9 w-9 rounded-lg border border-brand-border bg-slate-900 hover:border-[#667eea] hover:bg-[#667eea]/10 flex items-center justify-center transition-all"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4 text-slate-200 hover:text-[#667eea]" />
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
        <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="flex items-center gap-2 text-slate-400">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <span className="text-slate-500">
              ({pagination.totalItems} total items)
            </span>
          </div>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* View Shipment Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0f1116] border-b border-[#1e2329] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#f3ba2f]" />
                <h3 className="text-xl font-bold text-gray-100">
                  {shipmentLoading ? 'Loading...' : `Shipment #${selectedShipmentId}`}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-lg border border-[#1e2329] bg-[#0b0e11] hover:border-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {shipmentLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#f3ba2f] animate-spin" />
                </div>
              ) : selectedShipment ? (
                <>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(selectedShipment.status)}20`,
                        color: getStatusColor(selectedShipment.status),
                      }}
                    >
                      {statusIcon(selectedShipment.status)}
                      {selectedShipment.status}
                    </div>
                  </div>

                  {/* Shipment Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Shipment ID</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-100">#{selectedShipment.shipmentId}</p>
                    </div>

                    <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Product</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-100">{selectedShipment.productName}</p>
                    </div>

                    <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Route</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-100">
                        {selectedShipment.origin} → {selectedShipment.destination}
                      </p>
                    </div>

                    {selectedShipment.customer && (
                      <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">Customer</span>
                        </div>
                        <p className="text-sm font-mono text-gray-300">{shortAddress(selectedShipment.customer)}</p>
                      </div>
                    )}

                    {selectedShipment.driverName && (
                      <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">Driver</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-100">{selectedShipment.driverName}</p>
                      </div>
                    )}

                    {selectedShipment.vehiclePlate && (
                      <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">Vehicle</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-100">{selectedShipment.vehiclePlate}</p>
                      </div>
                    )}

                    {selectedShipment.createdAt && (
                      <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">Created</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          {new Date(selectedShipment.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e2329]">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-[#0b0e11] border border-[#1e2329] text-gray-300 rounded-lg hover:border-[#f3ba2f] hover:text-[#f3ba2f] transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleCloseModal();
                        handleEditShipment(selectedShipmentId);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-400">Không tìm thấy shipment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentList;