import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
const GuestRoute = ({ children }) => {
  const { authToken, isLoading } = useAuth();
 
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
 
  // If authenticated, redirect to home page
  if (authToken) {
    return <Navigate to="/home" />;
  }
 
  return children; // Render login/signup/landing if not authenticated
};
 
export default GuestRoute;