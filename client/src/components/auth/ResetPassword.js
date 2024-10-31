import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import NotificationBanner from "../NotificationBanner";
import useNotification from "../../services/useNotification";
import { TextInput } from "@tremor/react";
import { useCustomToast } from "../utils/useCustomToast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notification, showNotification, closeNotification } =
    useNotification();
  const toast = useCustomToast();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const token = searchParams.get("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`,
        { token, password }
      );
      toast(
        "Password reset successful! Redirecting you to login page...",
        "success"
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast("Failed to reset password. Please try again later.", "error");
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
          Reset Password
        </h1>
        <form onSubmit={handleResetPassword}>
          <TextInput
            type="password"
            placeholder="New Password"
            className="w-full p-2 border border-gray-300 rounded mb-4 tremor-brand-muted"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextInput
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 border border-gray-300 rounded mb-4 tremor-brand-muted"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-orange-600 text-white py-2 px-4 rounded shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 w-full"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
