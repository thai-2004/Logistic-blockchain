import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import ProtectedRoute from '@components/ProtectedRoute';
import HomePage from '@components/HomePage';
import Login from '@components/Login';
import { useAuth } from '@contexts/AuthContext';

// Lazy load heavy dashboard bundle
const ModernDashboard = lazy(() => import('@components/ModernDashboard'));

const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666',
    }}
  >
    <div>
      <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
      <p>Đang tải...</p>
    </div>
  </div>
);

// Wrapper component for Customer Dashboard routes
function CustomerDashboardRoute({ initialTab = 'dashboard' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/shipments') return 'shipments';
    if (path === '/create') return 'create';
    // Customer cannot access analytics or track - redirect to dashboard
    if (path === '/analytics' || path === '/track') return 'dashboard';
    return initialTab;
  };

  const handleRouteChange = (tab) => {
    // Prevent Customer from navigating to restricted tabs
    if (tab === 'analytics' || tab === 'track') {
      navigate('/dashboard');
      return;
    }
    const path =
      tab === 'dashboard'
        ? '/dashboard'
        : tab === 'shipments'
        ? '/shipments'
        : tab === 'create'
        ? '/create'
        : '/dashboard';
    navigate(path);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModernDashboard
        user={user}
        onLogout={logout}
        initialTab={getTabFromPath()}
        onRouteChange={handleRouteChange}
      />
    </Suspense>
  );
}

// Wrapper component for Owner Dashboard routes
function OwnerDashboardRoute() {
  const { user, logout } = useAuth();
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    if (location.pathname === '/owner') return 'dashboard';
    return tab || 'dashboard';
  };

  const handleRouteChange = (newTab) => {
    const path = newTab === 'dashboard' ? '/owner' : `/owner/${newTab}`;
    navigate(path);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModernDashboard
        user={user}
        onLogout={logout}
        initialTab={getTabFromPath()}
        onRouteChange={handleRouteChange}
      />
    </Suspense>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/home', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requireCustomer>
        <CustomerDashboardRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: '/shipments',
    element: (
      <ProtectedRoute requireCustomer>
        <CustomerDashboardRoute initialTab="shipments" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create',
    element: (
      <ProtectedRoute requireCustomer>
        <CustomerDashboardRoute initialTab="create" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute requireOwner>
        <OwnerDashboardRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: '/owner/:tab',
    element: (
      <ProtectedRoute requireOwner>
        <OwnerDashboardRoute />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);

export default router;

