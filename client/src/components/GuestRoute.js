import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { authToken, isLoading, fetchUserInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (authToken) {
        try {
          const userInfo = await fetchUserInfo();
          if (!userInfo.isParsedResume) {
            navigate("/uploadResume");
          } else {
            navigate("/profile");
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
