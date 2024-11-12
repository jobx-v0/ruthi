import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function InterviewTokenVerifier() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (status !== "loading") {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/interview/verify-interview-token",
          { token }
        );
        const { status: tokenStatus, job_id } = response.data;

        if (tokenStatus === "expired") {
          setStatus("expired");
        } else if (tokenStatus === "early") {
          setStatus("early");
        } else if (tokenStatus === "completed") {
          setStatus("completed");
        } else if (tokenStatus === "valid") {
          setStatus("valid");
          setTimeout(() => {
            navigate("/interview-preview", { state: { jobId: job_id } });
          }, 2000);
        } else {
          setStatus("invalid");
        }
      } catch (error) {
        if (error.response) {
          const { status: errorStatus } = error.response.data;

          if (errorStatus === "early") {
            setStatus("early");
          } else if (errorStatus === "expired") {
            setStatus("expired");
          } else if (errorStatus === "completed") {
            setStatus("completed");
          } else {
            setStatus("invalid");
          }
        } else {
          console.error("Error verifying token:", error);
          setStatus("error");
        }
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="relative p-1 max-w-md w-full bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
        {status === "loading" ? (
          <div className="flex flex-col items-center bg-gray-100 p-5 rounded-lg">
            <div
              className={`relative h-24 w-24 transition-opacity ${
                isTransitioning ? "animate-fade-out" : "opacity-100"
              }`}
            >
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-orange-600 border-gray-200 animate-spin-slow"></div>
            </div>
            <p className="mt-6 text-lg text-gray-700 font-medium text-center">
              Verifying your interview. Please wait a moment...
            </p>
          </div>
        ) : status === "valid" ? (
          <div className="flex flex-col items-center bg-green-100 p-5 rounded-lg">
            <div
              className={`text-green-500 transition-opacity ${
                isTransitioning ? "animate-fade-in" : "opacity-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#48bb78"
                strokeWidth="0.5"
              >
                <circle cx="12" cy="12" r="11" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <p className="mt-6 text-lg text-gray-700 font-medium">
              Interview verified successfully!
            </p>
          </div>
        ) : status === "expired" ? (
          <div className="flex flex-col items-center bg-red-100 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-red-600">Link Expired</h2>
            <p className="mt-6 text-lg text-red-600 font-medium text-center">
              It looks like this interview link has expired. Please contact
              support for further assistance.
            </p>
          </div>
        ) : status === "early" ? (
          <div className="flex flex-col items-center bg-yellow-100 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-600 ">
              Interview Not Yet Started
            </h2>
            <p className="mt-6 text-lg text-black font-medium text-center">
              You are trying to access the interview link before the scheduled
              time. Please come back later.
            </p>
          </div>
        ) : status === "completed" ? (
          <div className="flex flex-col items-center bg-red-100 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 ">
              Interview Completed
            </h2>
            <p className="mt-6 text-lg text-red-600 font-medium text-center">
              This interview has already been completed. If you have any
              questions, please reach out to support.
            </p>
          </div>
        ) : status === "invalid" ? (
          <div className="flex flex-col items-center bg-red-100 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 ">Invalid Link</h2>
            <p className="mt-6 text-lg text-red-600 font-medium text-center">
              This interview link is invalid. Please check the link or contact
              support if you believe this is an error.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mt-6 text-lg text-red-600 font-medium">
              An error occurred while verifying the interview link. Please try
              again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewTokenVerifier;
