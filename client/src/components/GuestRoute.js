import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { fetchUserProfile } from "../api/userProfileApi";

const GuestRoute = ({ children }) => {
  const { authToken, isLoading, fetchUserInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (authToken) {
        try {
          const response = await fetchUserProfile(authToken);
          if (response) {
            navigate("/profile");
          } else {
            navigate("/uploadResume");
          }
        } catch (error) {
          console.error("Error fetching user info", error);
        }
      }
    };

    if (!isLoading) {
      fetchUserAndNavigate();
    }
  }, [authToken, isLoading, fetchUserInfo, navigate]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return children;
};

export default GuestRoute;
