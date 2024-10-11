import axios from "axios";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/user-profile";

// save user profile data
export const saveUserProfileData = async (userId, data) => {
  const token = localStorage.getItem("authToken");
  if (!token || !userId) {
    toast.error("You must be logged in to save your profile.");
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.put(`${API_URL}/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error saving profile data:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      toast.error(
        `Failed to save: ${error.response.data.message || "Unknown error"}`
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("Failed to save. No response received from server.");
    } else {
      console.error("Error setting up request:", error.message);
      toast.error("Failed to save. Please try again.");
    }
    throw error;
  }
};

// fetch user profile
export const fetchUserProfile = async (authToken) => {
  console.log("auth token",authToken);
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Handle error (e.g., show a toast notification)
  }
};
