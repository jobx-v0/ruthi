import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobByIdAPI } from "../../api/jobApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
const DescriptionCard = ({ jobDetails }) => {
  return (
    <div className="rounded-lg p-8 bg-white shadow-lg mb-6 w-4/5 h-auto border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <img
          src={jobDetails.company_logo}
          alt={jobDetails.company_name}
          className="w-24 h-24 rounded-full border-4 border-orange-500"
        />
        <p className="text-gray-700 text-lg font-semibold text-right leading-relaxed">
          <strong>Posted Date:</strong>{" "}
          {new Date(jobDetails.posted_date).toLocaleDateString()}
        </p>
      </div>

      <h1 className="text-2xl font-extrabold mb-2 text-gray-900 leading-relaxed">
        {jobDetails.title}
      </h1>
      <hr className="border-gray-400 mb-6" />

      <div className="flex flex-wrap justify-between mb-3">
        <p className="text-gray-700 text-lg font-semibold w-full md:w-1/2 leading-relaxed">
          <strong>Company Name:</strong>{" "}
          <span className="text-gray-900">{jobDetails.company_name}</span>
        </p>
        <p className="text-gray-700 text-lg font-semibold w-full md:w-1/2 leading-relaxed">
          <strong>Job Type:</strong>{" "}
          <span className="text-gray-900">{jobDetails.employment_type}</span>
        </p>
        <p className="text-gray-700 text-lg font-semibold w-full md:w-1/2 leading-relaxed">
          <strong>Experience Required:</strong>{" "}
          <span className="text-gray-900">
            {jobDetails.experience_required} years
          </span>
        </p>
        <p className="text-gray-700 text-lg font-semibold w-full md:w-1/2 flex items-center leading-relaxed">
          <strong>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-2 text-orange-500"
            />
            Location:
          </strong>
          <span className="text-gray-900">{jobDetails.location}</span>
        </p>
      </div>

      <div className="mb-4">
        <strong className="text-xl text-gray-900 leading-relaxed">
          Skills Required:
        </strong>
        <ul className="pl-6 list-inside list-disc text-gray-700 text-lg leading-relaxed">
          {jobDetails.skills_required.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <p className="text-gray-700 text-lg mb-3 font-semibold leading-relaxed">
        <strong>Job Link:</strong>
        <a
          href={jobDetails.job_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 font-bold underline hover:text-blue-800"
        >
          Click here to view the job
        </a>
      </p>

      <div className="mb-4">
        <strong className="text-xl text-gray-900 leading-relaxed">
          Description:
        </strong>
        <ul className="pl-6 list-inside list-disc text-gray-700 text-lg leading-relaxed">
          <li>{jobDetails.description}</li>
        </ul>
      </div>

      {/* Display Custom Interview Questions and Answers */}
      <div className="mb-4">
        <strong className="text-xl text-gray-900 leading-relaxed">
          Custom Interview Question:
        </strong>
        <ul className="pl-6 list-inside list-none list-disc text-gray-700 text-lg leading-relaxed">
          {jobDetails.custom_interview &&
          jobDetails.custom_interview.length > 0 ? (
            jobDetails.custom_interview.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>Question:</strong> {item.question}
                </p>
                {item.answer ? (
                  <p>
                    <strong>Answer:</strong> {item.answer}
                  </p>
                ) : null}
              </li>
            ))
          ) : (
            <li>No custom interview questions available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const JobDescription = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("authToken");

      if (!id) {
        console.error("Job ID is undefined. Exiting fetch.");
        return;
      }

      try {
        const jobData = await fetchJobByIdAPI(token, id);
        setJobDetails(jobData);
        //console log jobdetails here
        console.log(jobData, "jobdetails");
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!jobDetails) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-5 flex-col">
      <DescriptionCard jobDetails={jobDetails} />
      <div className="flex justify-end w-full">
        <button
          onClick={() => navigate(`/EditJobModel/${id}`)}
          className="py-2 px-4 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-400 transition duration-300 mr-10"
        >
          Edit Job
        </button>
        <button
          onClick={() => navigate("/candidates")}
          className="py-2 px-4 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-400 transition duration-300 mr-36"
        >
          Show Candidates
        </button>
      </div>
    </div>
  );
};

export default JobDescription;
