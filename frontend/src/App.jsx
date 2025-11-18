// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from '@components/HomePage';
import Login from '@components/Login';
import ModernDashboard from '@components/ModernDashboard';
import OwnerDashboard from '@components/OwnerDashboard';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
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
                <CustomerDashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments"
            element={
              <ProtectedRoute requireCustomer>
                <CustomerDashboardWrapper initialTab="shipments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute requireCustomer>
                <CustomerDashboardWrapper initialTab="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireCustomer>
                <CustomerDashboardWrapper initialTab="analytics" />
              </ProtectedRoute>
            }
          />

          {/* Protected Owner routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute requireOwner>
                <OwnerDashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/:tab"
            element={
              <ProtectedRoute requireOwner>
                <OwnerDashboardWrapper />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
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

// Wrapper component for Owner Dashboard
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
    <OwnerDashboard
      user={user}
      onLogout={logout}
      initialTab={getTabFromPath()}
      onRouteChange={handleRouteChange}
    />
  );
}

export default App;
