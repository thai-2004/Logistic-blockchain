// frontend/src/components/TrackShipment.jsx
import React, { useState } from 'react';
import { Search, Package, MapPin, User, Truck, Hash, Loader2, CheckCircle2, Clock, AlertCircle, CircleCheckBig } from 'lucide-react';
import { shipmentAPI } from '@services/api';
import { getStatusColor } from '@shared/constants/status';

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

  const getStatusIconComponent = (status) => {
    switch (status) {
      case 'Delivered':
        return <CircleCheckBig className="w-5 h-5" />;
      case 'In Transit':
        return <Truck className="w-5 h-5" />;
      case 'Created':
      case 'Processing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-3 rounded-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100">Track Your Shipment</h2>
        </div>
        <p className="text-gray-400">Enter your shipment ID to view real-time tracking information</p>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleTrack} className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="number"
              placeholder="Enter Shipment ID (e.g., 12345)"
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-[#0b0e11] border border-[#1e2329] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Track Shipment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-semibold mb-1">Tracking Error</h4>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Result */}
      {trackingData && trackingData.shipment && (
        <div className="space-y-6">
          {/* Shipment Details Card */}
          <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#f3ba2f]" />
                <h3 className="text-xl font-semibold text-gray-100">Shipment Details</h3>
              </div>
              <div
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                style={{
                  backgroundColor: `${getStatusColor(trackingData.shipment.status)}20`,
                  color: getStatusColor(trackingData.shipment.status),
                }}
              >
                {getStatusIconComponent(trackingData.shipment.status)}
                {trackingData.shipment.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Shipment ID</span>
                </div>
                <p className="text-lg font-semibold text-gray-100">#{trackingData.shipment.shipmentId}</p>
              </div>

              <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Product</span>
                </div>
                <p className="text-lg font-semibold text-gray-100">{trackingData.shipment.productName}</p>
              </div>

              <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Route</span>
                </div>
                <p className="text-lg font-semibold text-gray-100">
                  {trackingData.shipment.origin} → {trackingData.shipment.destination}
                </p>
              </div>

              {trackingData.shipment.customer && (
                <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Customer</span>
                  </div>
                  <p className="text-sm font-mono text-gray-300">
                    {trackingData.shipment.customer.slice(0, 10)}...{trackingData.shipment.customer.slice(-8)}
                  </p>
                </div>
              )}

              {trackingData.shipment.driverName && (
                <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Driver</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-100">{trackingData.shipment.driverName}</p>
                </div>
              )}

              {trackingData.shipment.vehiclePlate && (
                <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Vehicle</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-100">{trackingData.shipment.vehiclePlate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          {trackingData.timeline && trackingData.timeline.length > 0 && (
            <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#f3ba2f]" />
                <h3 className="text-xl font-semibold text-gray-100">Tracking Timeline</h3>
              </div>
              <div className="space-y-4">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-500'
                        }`}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-[#1e2329] mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                        <h4 className="font-semibold text-gray-100 mb-1">{event.status}</h4>
                        <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackShipment;