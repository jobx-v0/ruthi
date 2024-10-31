import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCustomToast } from "../components/utils/useCustomToast";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/auth";

const VerifyEmailPrompt = () => {
  const location = useLocation();
  const userInfo = location.state;
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);

  const resendVerificationEmail = async () => {    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/resend-verification-email`, {
        email: userInfo.email,
      });
      toast("Verification email sent!","success");
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast("Failed to resend verification email. Please try again later.","error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
          Email Verification Required
        </h1>
        <p className="mb-6 text-gray-600 text-center leading-relaxed">
          Your email address has not been verified. Please check your email for
          the verification link or request a new one below.
        </p>
        <button
          onClick={resendVerificationEmail}
          className={`bg-orange-600 text-white font-medium w-full py-2 rounded-lg shadow hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPrompt;
