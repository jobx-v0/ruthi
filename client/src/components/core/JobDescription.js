import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobByIdAPI } from '../../api/jobApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const DescriptionCard = ({ jobDetails }) => {
  return (
    <div style={{
      border: '1px solid #f97316', // Highlighted border color
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      width: '80%', // Decreased width
      height: '600px', // Increased height
      overflow: 'auto', // Ensure content fits well within the card
    }}>
      <img 
        src={jobDetails.company_logo} 
        alt={jobDetails.company_name} 
        style={{ 
          width: '80px', // Adjusted size for logo
          height: '80px',
          borderRadius: '50%', // Rounded logo
          marginBottom: '10px', 
          border: '2px solid #f97316' // Highlighted border around logo
        }} 
      />
      <h1 style={{
        color: '#000000',
        fontSize: '20px', // Adjusted font size
        marginBottom: '5px'
      }}>
        {jobDetails.title}
      </h1>
      <hr style={{ border: '1px solid #f97316', marginBottom: '15px' }} />
      <p style={{
        color: '#6b7280', // light black or gray
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Company Name:</strong> {jobDetails.company_name}
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Posted Date:</strong> {new Date(jobDetails.posted_date).toLocaleDateString()}
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Job Type:</strong> {jobDetails.employment_type}
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Experience Required:</strong> {jobDetails.experience_required} years
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' ,color:'#fb923c'}} />
          Location:
        </strong> {jobDetails.location}
      </p>
      <div style={{ marginBottom: '10px' }}>
        <strong>Description:</strong>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
          <li>{jobDetails.description}</li>
        </ul>
      </div>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Skills Required:</strong>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
          {jobDetails.skills_required.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px', // Adjusted font size
        lineHeight: '1.5',
        marginBottom: '10px'
      }}>
        <strong>Job Link:</strong>
        <a 
          href={jobDetails.job_link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'underline' }}
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
    return <div>Error: {error}</div>;
  }

  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', // Full viewport height for centering
      padding: '20px', 
      flexDirection: 'column' // Arrange children in a column
    }}>
      <DescriptionCard jobDetails={jobDetails} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button onClick={() => navigate('/candidates')} style={{
          padding: '10px 20px',
          backgroundColor: '#f97316',
          color: '#ffffff',
          fontSize: '14px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          marginRight: '150px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fb923c'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}>
          Show Candidates
        </button>
      </div>
    </div>
  );
};

export default JobDescription;
