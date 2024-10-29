"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { isSubmittedState } from "../../store/atoms/userProfileSate";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { updateUserAPI } from "../../api/authApi";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ThankyouCard() {
  const setIsSubmitted = useSetRecoilState(isSubmittedState);
  const { authToken } = useAuth();
  const handleEditProfile = async() => {
    setIsSubmitted(false);
    localStorage.setItem("isSubmitted", "false");
    await updateUserAPI({
      data: { isProfileSubmitted: false },
      authToken: authToken
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-10 shadow-xl max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8"
        >
          <FaCheckCircle className="w-full h-full text-orange-500" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We've successfully created your profile. We're excited to help you
          find the perfect job opportunities that match your skills and
          aspirations.
        </p>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We'll be in touch soon with curated job matches and personalized
          career advice. Keep an eye on your inbox for updates!
        </p>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
            onClick={handleEditProfile}
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
