import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authToken, isLoading } = useAuth();

  // Show a loading spinner or component while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner or loading component
  }

  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;