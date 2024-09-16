import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/auth";

const VerifyEmailPrompt = () => {
  const { userInfo } = useAuth();

  const resendVerificationEmail = async () => {
    try {
      await axios.post(`${API_URL}/resend-verification-email`, { email: userInfo.email });
      alert("Verification email sent!");
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("Failed to resend verification email. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-5 lg:p-8 rounded shadow-xl border-1 border-slate-100 w-11/12 lg:w-96 mx-2">
        <h1 className="text-2xl font-bold mb-4 text-gray-600 text-center">
          Email Verification Required
        </h1>
        <p className="mb-4 text-gray-700 text-center">
          Your email address has not been verified. Please check your email for the verification link or request a new verification email.
        </p>
        <button
          onClick={resendVerificationEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Resend Verification Email
        </button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Not received the email? <a href="#" onClick={resendVerificationEmail} className="text-blue-700 font-semibold">Resend it</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPrompt;
