import React from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";

const DownloadPdf = ({ interviewId }) => {
  const handleDownload = async () => {
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
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download/View PDF</button>
    </div>
  );
};

export default DownloadPdf;
