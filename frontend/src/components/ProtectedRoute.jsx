import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requireOwner = false, requireCustomer = false }) => {
  const { isAuthenticated, isOwner, isCustomer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOwner && !isOwner()) {
    // Customer trying to access owner route
    return <Navigate to="/dashboard" replace />;
  }

  if (requireCustomer && !isCustomer()) {
    // Owner trying to access customer route
    return <Navigate to="/owner" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireOwner: PropTypes.bool,
  requireCustomer: PropTypes.bool,
};

export default ProtectedRoute;

