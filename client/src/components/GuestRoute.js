import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUserAPI } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { authToken, isLoading, fetchUserInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (authToken) {
        try {
          const userInfo = await fetchUserInfo();
          console.log(userInfo);
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

    fetchUserAndNavigate();
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  // // If authenticated, redirect to home page
  // if (authToken) {
  //   return <Navigate to="/home" />;
  // }

  return children; // Render login/signup/landing if not authenticated
};

export default GuestRoute;
