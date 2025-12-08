// frontend/src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from '@components/HomePage';
import Login from '@components/Login';
import './styles/App.css';
import './assets/styles/Toast.css';

// Lazy load heavy components for performance
const ModernDashboard = lazy(() => import('@components/ModernDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>
      <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
      <p>Đang tải...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Customer routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireCustomer>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDashboardWrapper />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments"
            element={
              <ProtectedRoute requireCustomer>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDashboardWrapper initialTab="shipments" />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute requireCustomer>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDashboardWrapper initialTab="create" />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireCustomer>
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDashboardWrapper initialTab="analytics" />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Protected Owner routes (reuse same dashboard) */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute requireOwner>
                <Suspense fallback={<LoadingFallback />}>
                  <OwnerDashboardWrapper />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/:tab"
            element={
              <ProtectedRoute requireOwner>
                <Suspense fallback={<LoadingFallback />}>
                  <OwnerDashboardWrapper />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

// Wrapper component for Customer Dashboard
function CustomerDashboardWrapper({ initialTab = 'dashboard' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from URL
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/shipments') return 'shipments';
    if (path === '/create') return 'create';
    if (path === '/analytics') return 'analytics';
    return initialTab;
  };

  const handleRouteChange = (tab) => {
    const path =
      tab === 'dashboard'
        ? '/dashboard'
        : tab === 'shipments'
        ? '/shipments'
        : tab === 'create'
        ? '/create'
        : '/analytics';
    navigate(path);
  };

    return (
      <ModernDashboard 
        user={user} 
      onLogout={logout}
      initialTab={getTabFromPath()}
      onRouteChange={handleRouteChange}
      />
    );
  }

// Wrapper component for Owner (uses same ModernDashboard)
function OwnerDashboardWrapper() {
  const { user, logout } = useAuth();
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from URL
  const getTabFromPath = () => {
    if (location.pathname === '/owner') return 'dashboard';
    return tab || 'dashboard';
  };

  const handleRouteChange = (newTab) => {
    const path = newTab === 'dashboard' ? '/owner' : `/owner/${newTab}`;
    navigate(path);
  };

    return (
      <ModernDashboard 
        user={user} 
        onLogout={logout}
        initialTab={getTabFromPath()}
        onRouteChange={handleRouteChange}
      />
    );
  }

export default App;
