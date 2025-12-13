import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Search,
  Settings,
  Bell,
  MessageCircle,
  Truck,
} from 'lucide-react';

const navItems = [
  { tab: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Customer', 'Owner'] },
  { tab: 'shipments', icon: Package, label: 'My Shipments', roles: ['Customer', 'Owner'] },
  { tab: 'analytics', icon: BarChart3, label: 'Analytics', roles: ['Owner'] },
  { tab: 'track', icon: Search, label: 'Track Package', roles: ['Owner'] },
  { tab: 'settings', icon: Settings, label: 'Settings', roles: ['Customer', 'Owner'] },
];

const DashboardLayout = ({ user, activeTab, onTabChange, onLogout, children }) => {
  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-panel border-r border-brand-border flex flex-col shadow-lg shadow-black/40">
        <div className="px-6 py-6 border-b border-brand-border flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-brand-border flex items-center justify-center text-brand-primary">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-brand-primary">LogiChain</div>
            <div className="text-xs text-slate-400">Binance-style dashboard</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNavItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition',
                'border border-transparent hover:border-brand-border hover:bg-slate-900/70',
                activeTab === item.tab
                  ? 'bg-slate-900 text-brand-primary border-brand-border shadow-inner shadow-brand-primary/20'
                  : 'text-slate-200'
              )}
            >
              <item.icon className="h-5 w-5 text-brand-primary" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-4 py-5 border-t border-brand-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="text-slate-100 text-sm font-semibold">{user?.name || 'User'}</div>
            <div className="text-slate-400 text-xs">{user?.role || 'User'}</div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-brand-primary hover:text-white border border-brand-border px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-panel/90 backdrop-blur px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'shipments' && 'My Shipments'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'track' && 'Track Package'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-sm text-slate-400">Logistics on-chain control panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-border bg-slate-900">
              <Search className="h-4 w-4 text-brand-primary" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <button className="h-10 w-10 rounded-xl border border-brand-border bg-slate-900 flex items-center justify-center">
              <Bell className="h-5 w-5 text-slate-200" />
            </button>
            <button className="h-10 w-10 rounded-xl border border-brand-border bg-slate-900 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-slate-200" />
            </button>
          </div>
        </header>

        <main className="px-8 py-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
  }),
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;

