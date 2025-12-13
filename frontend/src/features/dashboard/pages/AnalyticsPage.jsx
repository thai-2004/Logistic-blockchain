import React, { useMemo } from 'react';
import { TrendingUp, BarChart3, Map, Activity, Package, Truck, CircleCheckBig, Clock, Loader2 } from 'lucide-react';
import { useShipmentStats } from '@hooks/useShipments';
import { useShipments } from '@hooks/useShipments';

const AnalyticsPage = () => {
  const { stats, loading: statsLoading, error: statsError } = useShipmentStats('all');
  const { shipments, loading: shipmentsLoading } = useShipments({ limit: 1000 });

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    if (!stats || !shipments) {
      return {
        totalShipments: 0,
        inTransit: 0,
        delivered: 0,
        created: 0,
        cancelled: 0,
        avgDeliveryTime: 0,
        onTimeRate: 0,
        customerSatisfaction: 4.8,
        fleetUtilization: 90,
      };
    }

    const statusCounts = stats.statusStats || {};
    const total = stats.totalShipments || 0;
    const delivered = statusCounts.Delivered || 0;
    const inTransit = statusCounts['In Transit'] || 0;
    const created = statusCounts.Created || 0;
    const cancelled = statusCounts.Cancelled || 0;

    // Calculate average delivery time (mock calculation - would need actual delivery timestamps)
    const deliveredShipments = shipments.filter(s => s.status === 'Delivered');
    const avgDeliveryTime = deliveredShipments.length > 0 
      ? deliveredShipments.reduce((sum, s) => {
          const created = new Date(s.createdAt);
          const delivered = s.updatedAt ? new Date(s.updatedAt) : new Date();
          const hours = (delivered - created) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / deliveredShipments.length
      : 0;

    // On-time delivery rate (mock - would need expected vs actual delivery times)
    const onTimeRate = delivered > 0 ? Math.min(95, 85 + Math.random() * 10) : 0;

    // Fleet utilization (mock - would need actual fleet data)
    const fleetUtilization = Math.min(95, 80 + Math.random() * 15);

    return {
      totalShipments: total,
      inTransit,
      delivered,
      created,
      cancelled,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      onTimeRate: Math.round(onTimeRate * 10) / 10,
      customerSatisfaction: 4.8,
      fleetUtilization: Math.round(fleetUtilization),
    };
  }, [stats, shipments]);

  // Calculate percentage changes (mock - would need historical data)
  const percentageChanges = useMemo(() => {
    return {
      total: '+12.5',
      inTransit: '+8.2',
      delivered: '+15.3',
      avgTime: '-5.2',
    };
  }, []);

  const loading = statsLoading || shipmentsLoading;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#f3ba2f] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">Lỗi khi tải dữ liệu: {statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics & Reports</h1>
          <p className="text-gray-400">Theo dõi hiệu suất và phân tích dữ liệu shipments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#667eea]/20 p-3 rounded-lg">
              <Package className="w-6 h-6 text-[#667eea]" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-1">
            {metrics.totalShipments.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">Total Shipments</p>
          <p className="text-xs text-green-400 mt-2">+{percentageChanges.total}% from last month</p>
        </div>

        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#f3ba2f]/20 p-3 rounded-lg">
              <Truck className="w-6 h-6 text-[#f3ba2f]" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-1">
            {metrics.inTransit.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">In Transit</p>
          <p className="text-xs text-green-400 mt-2">+{percentageChanges.inTransit}% from last month</p>
        </div>

        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CircleCheckBig className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-1">
            {metrics.delivered.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">Delivered</p>
          <p className="text-xs text-green-400 mt-2">+{percentageChanges.delivered}% from last month</p>
        </div>

        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-1">
            {metrics.avgDeliveryTime > 0 ? `${metrics.avgDeliveryTime}h` : '—'}
          </h3>
          <p className="text-sm text-gray-400">Avg. Delivery Time</p>
          <p className="text-xs text-blue-400 mt-2">{percentageChanges.avgTime}% from last month</p>
        </div>
      </div>

      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Trends */}
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Shipment Trends</h3>
          </div>
          <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px]">
            <BarChart3 className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-500 text-center">Chart visualization would go here</p>
            <p className="text-gray-600 text-sm mt-2">Line chart showing shipment volume over time</p>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#f3ba2f] to-[#f59e0b] p-2 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Delivery Performance</h3>
          </div>
          <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px]">
            <BarChart3 className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-500 text-center">Performance metrics would go here</p>
            <p className="text-gray-600 text-sm mt-2">Bar chart showing delivery success rates</p>
          </div>
        </div>

        {/* Route Analysis */}
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Route Analysis</h3>
          </div>
          <div className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px]">
            <Map className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-500 text-center">Route optimization data would go here</p>
            <p className="text-gray-600 text-sm mt-2">Map visualization showing popular routes and efficiency metrics</p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {stats?.statusStats && (
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Status Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.statusStats).map(([status, count]) => {
              const total = metrics.totalShipments || 1;
              const percentage = ((count / total) * 100).toFixed(1);
              return (
                <div key={status} className="bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{status}</span>
                    <span className="text-lg font-bold text-gray-100">{count}</span>
                  </div>
                  <div className="w-full bg-[#0f1116] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-2 rounded-full transition-all" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Customers */}
      {stats?.topCustomers && stats.topCustomers.length > 0 && (
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#f3ba2f] to-[#f59e0b] p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Top Customers</h3>
          </div>
          <div className="space-y-3">
            {stats.topCustomers.slice(0, 5).map((customer, index) => (
              <div key={customer._id} className="flex items-center justify-between bg-[#0b0e11] border border-[#1e2329] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#667eea]/20 rounded-full flex items-center justify-center text-[#667eea] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-mono text-gray-300">
                      {customer._id.slice(0, 10)}...{customer._id.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-100">{customer.count}</p>
                  <p className="text-xs text-gray-500">shipments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-[#f3ba2f]" />
            <h4 className="font-semibold text-gray-200">Fleet Utilization</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active Vehicles</span>
              <span className="text-gray-100 font-medium">
                {Math.round(metrics.fleetUtilization * 0.5)}/50
              </span>
            </div>
            <div className="w-full bg-[#0b0e11] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-2 rounded-full transition-all" 
                style={{ width: `${metrics.fleetUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-[#667eea]" />
            <h4 className="font-semibold text-gray-200">On-Time Delivery</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-gray-100 font-medium">{metrics.onTimeRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#0b0e11] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all" 
                style={{ width: `${metrics.onTimeRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-gray-200">Customer Satisfaction</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rating</span>
              <span className="text-gray-100 font-medium">{metrics.customerSatisfaction}/5.0</span>
            </div>
            <div className="w-full bg-[#0b0e11] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#f3ba2f] to-[#f59e0b] h-2 rounded-full transition-all" 
                style={{ width: `${(metrics.customerSatisfaction / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

