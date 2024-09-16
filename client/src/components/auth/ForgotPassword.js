import { useState } from "react";
import axios from "axios";
import NotificationBanner from "../NotificationBanner";
import useNotification from "../../services/useNotification";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { notification, showNotification, closeNotification } =
    useNotification();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );
      showNotification(
        "Password reset link sent. Please check your email.",
        "success"
      );
    } catch (error) {
      showNotification(
        "Failed to send password reset link. Please try again later.",
        "error"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        {notification && (
          <NotificationBanner
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
        <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-orange-600 text-white py-2 px-4 rounded shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
