import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobByIdAPI } from '../../api/jobApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import EditJobModel from "./EditJobModel";

const DescriptionCard = ({ jobDetails }) => {
  return (
    <div className="rounded-lg p-6 bg-white shadow-md mb-5 w-4/5 h-[600px] overflow-auto">
      <img 
        src={jobDetails.company_logo} 
        alt={jobDetails.company_name} 
        className="w-20 h-20 rounded-full mb-2 border-2 border-orange-500"
      />
      <h1 className="text-black text-lg mb-1">{jobDetails.title}</h1>
      <hr className="border-black mb-4" />
      <p className="text-gray-600 text-sm mb-2">
        <strong>Company Name:</strong> {jobDetails.company_name}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Posted Date:</strong> {new Date(jobDetails.posted_date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Job Type:</strong> {jobDetails.employment_type}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Experience Required:</strong> {jobDetails.experience_required} years
      </p>
      <p className="text-gray-600 text-sm mb-2 flex items-center">
        <strong>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-orange-500" />
          Location:
        </strong> {jobDetails.location}
      </p>
      <div className="mb-2">
        <strong>Description:</strong>
        <ul className="pl-5 list-disc">
          <li>{jobDetails.description}</li>
        </ul>
      </div>
      <div className="mb-2">
        <strong>Skills Required:</strong>
        <ul className="pl-5 list-disc">
          {jobDetails.skills_required.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Job Link:</strong>
        <a 
          href={jobDetails.job_link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-700 font-bold underline"
        >
          Click here to view the job
        </a>
      </p>
    </div>
  );
};

const JobDescription = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);


  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem('authToken');

      if (!id) {
        console.error("Job ID is undefined. Exiting fetch.");
        return;
      }

      try {
        const jobData = await fetchJobByIdAPI(token, id);
        setJobDetails(jobData);
        console.log(jobData, "logging");
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
          onClick={() => setEditModalOpen(true)} 
          className="py-2 px-4 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-400 transition duration-300 mr-10"
        >
          Edit Job
        </button>
        <button 
          onClick={() => navigate('/candidates')} 
          className="py-2 px-4 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-400 transition duration-300 mr-36"
        >
          Show Candidates
        </button>
      </div>
      {isEditModalOpen && <EditJobModel onClose={() => setEditModalOpen(false)} />} {/* Render the EditJobModel */}
    </div>
  );
};

export default JobDescription;
