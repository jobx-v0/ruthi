import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";

const ViewWebmVideo = ({ interviewId, questionId }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const videoRef = useRef();

  const handleViewVideo = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${API_URL}/download-webm-video/${interviewId}/${questionId}`,
        {
          responseType: "blob",
        }
      );

      const videoBlob = new Blob([response.data], { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);

      setVideoUrl(videoUrl);
      setLoading(false); // End loading once video is ready

      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error downloading the video:", error);
      setLoading(false); // Stop loading if there's an error
    }
  };

  useEffect(() => {
    handleViewVideo();
  }, [interviewId, questionId]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-75">
          <div className="spinner"></div>
          <span className="text-gray-700 mt-2">Loading video...</span>
        </div>
      )}

      {videoUrl && !loading && (
        <video ref={videoRef} controls className="w-full h-full object-cover">
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default ViewWebmVideo;
