import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Adjust the import path based on your project structure

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/auth"; // Assuming the API URL is defined in your environment variables
const mode = process.env.MODE;
const emailServiceEnabled =true;

const VerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userInfo, setToken } = useAuth(); // Get userInfo from AuthContext

  useEffect(() => {
    if (!isLoading) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // match the duration of the transition
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

 
    


  useEffect(() => {

    if (mode=='dev') {
      // Automatically set user as verified in dev mode
      setIsVerified(true);
      return;
    }
  
    // Skip verification if email service is disabled
    if (!emailServiceEnabled) {
      // Check if the user has uploaded their resume
      if (userInfo?.hasUploadedResume) {
        navigate("/profile");
      } else {
        navigate("/uploadResume");
      }
      return;
    }
  }, [emailServiceEnabled, navigate, userInfo]);

  useEffect(() => {
    if (userInfo?.isVerified) {
      setTimeout(() => {
        return navigate("/profile");
      }, 3000);
    }

    const verifyEmail = async () => {
      const token = searchParams.get("token");

      try {
        const response = await axios.post(`${API_URL}/verify-email`, {
          token,
        });
        setToken(token);

        if (response.status === 200) {
          setIsVerified(true);
          setIsLoading(false);
          navigate("/uploadResume");
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        // Handle error (e.g., show an error message or redirect to an error page)
      }
    };

    setTimeout(() => {
      verifyEmail();
    }, 3000);
  }, [navigate, searchParams, userInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="relative p-6 max-w-md w-full bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div
              className={`relative h-24 w-24 transition-opacity ${
                isTransitioning ? "animate-fade-out" : "opacity-100"
              }`}
            >
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-orange-600 border-gray-200 animate-spin-slow"></div>
            </div>
            <p className="mt-6 text-lg text-gray-700 font-medium">
              Verifying your email...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center">
            <div
              className={`text-green-500 transition-opacity ${
                isTransitioning ? "animate-fade-in" : "opacity-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#48bb78"
                strokeWidth="0.5"
              >
                <circle cx="12" cy="12" r="11" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <p className="mt-6 text-lg text-gray-700 font-medium">
              Email verified successfully!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mt-6 text-lg text-red-600 font-medium">
              An error occurred while verifying your email. Please try again
              later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
