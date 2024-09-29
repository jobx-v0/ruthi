import axios from "axios";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/user-profile";

// save or create user profile data
export const saveUserProfileData = async (userId, data) => {
  const token = localStorage.getItem("authToken");
  if (!token || !userId) {
    toast.error("You must be logged in to save your profile.");
    throw new Error("Authentication required");
  }

  try {
    let response;
    
    // First, try to update the existing profile
    try {
      response = await axios.put(`${API_URL}/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // If the profile doesn't exist (404 error), create a new one
      if (error.response && error.response.status === 404) {
        response = await axios.post(API_URL, { ...data, userId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // If it's not a 404 error, rethrow it
        throw error;
      }
    }

    console.log("Profile data saved successfully:", response.data);
    // toast.success("Profile data saved successfully!");
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
export const fetchUserProfile = async (userId) => {
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (error.response && error.response.status === 404) {
      // If profile doesn't exist, return null or an empty object
      return null; // or return {};
    }
    // Handle other errors (e.g., show a toast notification)
    toast.error("Failed to fetch user profile. Please try again.");
    throw error;
  }
};
