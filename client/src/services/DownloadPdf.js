import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";

const DownloadPdf = ({ interviewId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/download-pdf/${interviewId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full bg-orange-600 text-white py-2 rounded-lg flex justify-center items-center ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-6 w-6 mr-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      ) : (
        <>View Detailed Report</>
      )}
    </button>
  );
};

export default DownloadPdf;
