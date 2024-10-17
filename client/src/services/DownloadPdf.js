import React from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";

const DownloadPdf = () => {
  const handleDownload = async () => {
    try {
      const interviewId = "6710d080fbc135de4b73978e";

      const response = await axios.get(
        `${API_URL}/download-pdf/${interviewId}`,
        {
          responseType: "blob",
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the PDF blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download/View PDF</button>
    </div>
  );
};

export default DownloadPdf;
