import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin access
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Approval check for stores (allow Pricing page for payment)
  if (user?.role === 'store' && !user?.isApproved && location.pathname !== '/pricing') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
