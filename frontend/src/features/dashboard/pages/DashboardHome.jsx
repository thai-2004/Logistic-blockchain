import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getStatusColor, getStatusIcon } from '@shared/constants/status';
import { Package, Truck, CircleCheckBig, Timer, Plus, Search, BarChart3, Settings, ShieldCheck, Activity } from 'lucide-react';

const DashboardHome = ({ shipments, onTabChange }) => {
  const stats = useMemo(() => ({
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'In Transit').length,
    delivered: shipments.filter((s) => s.status === 'Delivered').length,
  }), [shipments]);

  const deliveredRate = stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0;

  const handleCreateClick = useCallback(() => {
    onTabChange('create');
  }, [onTabChange]);

  const handleViewShipments = useCallback(() => {
    onTabChange('shipments');
  }, [onTabChange]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card-panel p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-brand-border relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Welcome back</p>
            <h2 className="text-2xl font-bold text-slate-50">Logistics Overview</h2>
            <p className="text-slate-400 text-sm max-w-xl">Track, create, and analyze your on-chain shipments in real-time with a Binance-inspired control panel.</p>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="px-2 py-1 rounded-lg bg-slate-900 border border-brand-border text-brand-primary font-semibold">Live</span>
              <span>Delivered rate: <span className="text-slate-50 font-semibold">{deliveredRate}%</span></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Active shipments: <span className="text-slate-50 font-semibold">{stats.inTransit}</span></span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={handleCreateClick}>
              <Plus className="h-4 w-4" /> Create Shipment
            </button>
            <button className="btn-ghost" onClick={() => onTabChange('track')}>
              <Search className="h-4 w-4" /> Track Package
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Shipments', value: stats.total, icon: Package, color: 'from-brand-primary/20 to-brand-primary/5' },
          { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'from-sky-400/20 to-sky-500/5' },
          { label: 'Delivered', value: stats.delivered, icon: CircleCheckBig, color: 'from-emerald-400/20 to-emerald-500/5' },
          { label: 'Avg. Delivery', value: '-', icon: Timer, color: 'from-purple-400/20 to-purple-500/5' },
        ].map((card) => (
          <div
            key={card.label}
            className={`card-panel p-4 flex items-center gap-3 bg-gradient-to-br ${card.color}`}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-lg">
              <card.icon className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
              <div className="text-2xl font-bold text-slate-50">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="card-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">Recent Shipments</h2>
          <button className="btn-ghost" onClick={handleViewShipments}>View All</button>
        </div>
        <div className="space-y-3">
          {shipments.length === 0 ? (
            <div className="text-sm text-slate-400">No shipments yet. Create or track shipments to see them here.</div>
          ) : (
            shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between rounded-xl border border-brand-border bg-slate-900/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">📦</div>
                  <div>
                    <div className="text-slate-100 font-semibold">{shipment.trackingNumber}</div>
                    <div className="text-slate-400 text-sm">{shipment.from} → {shipment.to}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="status-chip" style={{ backgroundColor: `${getStatusColor(shipment.status)}20`, color: getStatusColor(shipment.status) }}>
                    <span className="status-icon">{getStatusIcon(shipment.status)}</span>
                    {shipment.status}
                  </span>
                  <div className="text-sm text-slate-400">{shipment.estimatedDelivery}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">Quick Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-primary justify-center" onClick={handleCreateClick}>
            <Plus className="h-4 w-4" /> Create Shipment
          </button>
          <button className="btn-ghost justify-center" onClick={() => onTabChange('track')}>
            <Search className="h-4 w-4" /> Track Package
          </button>
          <button className="btn-ghost justify-center" onClick={() => onTabChange('analytics')}>
            <BarChart3 className="h-4 w-4" /> View Reports
          </button>
          <button className="btn-ghost justify-center" onClick={() => onTabChange('settings')}>
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* Health & compliance */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">System Health</p>
            <div className="text-lg font-semibold text-slate-50">99.9% uptime</div>
            <p className="text-sm text-slate-500">Auto-sync with on-chain events</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-brand-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <div className="card-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Activity</p>
            <div className="text-lg font-semibold text-slate-50">Live tracking</div>
            <p className="text-sm text-slate-500">Monitor checkpoints & updates</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-brand-primary">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  shipments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default DashboardHome;

