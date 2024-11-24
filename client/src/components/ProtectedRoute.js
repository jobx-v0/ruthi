import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { authToken, isLoading } = useAuth();
  const currentPath = location.pathname;

  // Show a loading spinner or component while checking authentication
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!authToken) {
    sessionStorage.setItem("redirectPath", currentPath);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
