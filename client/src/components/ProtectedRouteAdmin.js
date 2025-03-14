import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRouteForAdmin = ({ children }) => {
  const { authToken, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (authToken) {
      try {
        const decoded = jwtDecode(authToken); 
        if (decoded && decoded.role === "admin") {
          setIsAuthorized(true); 
        } else {
          navigate("/"); 
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        navigate("/"); 
      }
    } else {
      navigate("/"); // Redirect to home if no token exists
    }
  }, [authToken, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (isAuthorized) {
    return children;
  }

  return null;
};

export default ProtectedRouteForAdmin;
