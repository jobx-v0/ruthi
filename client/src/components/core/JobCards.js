import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from '../../ui/sidebar';
import { IconBriefcase, IconUser, IconPlus, IconTrash} from '@tabler/icons-react';
import { fetchJobsAPI , deleteJobAPI } from '../../api/jobApi';
import ConfirmationModal from './ConfirmDeleteCard';
import { useCustomToast } from "../utils/useCustomToast"; 

const JobCard = ({ job, onOpenModal  }) => {
  const navigate = useNavigate();

  const formatPostedDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleCardClick = () => {
    navigate(`/JobDescription/${job._id}`);
  };

  return (
    <div
      className="job-card"
      onClick={handleCardClick}
      style={{
        width: '30%',
        minWidth: '300px',
        maxWidth: '380px',
        border: 'none',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.3s',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
      }}
    >
      <div style={{ paddingBottom: '15px' }}>
        <div
            style={{
              display: 'flex',
              justifyContent: 'space-between', // Positions children at opposite ends
              alignItems: 'center', // Centers items vertically
              position: 'relative', // Required for absolute positioning of the icon
              marginBottom: '15px', // Add space below the flex container
            }}
            >
            <img
              src={job.company_logo}
              alt={`${job.company_name} logo`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              }}
            />
            {/* Delete Icon */}
            <IconTrash
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigation on delete
              onOpenModal(job._id); // Open the modal with job ID
            }}
            style={{ color: '#f87171', cursor: 'pointer', fontSize: '20px' }}
          />
          </div>        
        {/* Posted date */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#0284c7',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginLeft: '120px',
          }}
        >
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
          Posted on {formatPostedDate(job.posted_date)}
        </span>
        {/* Title aligned to the left */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '10px',
            textAlign: 'left',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          {job.title}
        </h3>

        {/* Job Location with FontAwesome Location Icon */}
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#ef4444', fontSize: '16px' }} />
          {job.location}
        </p>

        {/* Employment Type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', maxWidth: '100px' }}>{job.employment_type}</p>
          {/* "+Today" Text with Green Background */}
          <span
            style={{
              backgroundColor: '#bbf7d0',
              color: '#065f46',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            +Today
          </span>
        </div>
      </div>

      <a
        href={job.job_link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#3b82f6',
          fontSize: '15px',
          fontWeight: '500',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#f3f4f6',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'background-color 0.3s, color 0.3s',
          width: '100%',
          display: 'block',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
      >
        Applications
      </a>
    </div>
  );
};

// JobList Component
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experience, setExperience] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const showToast = useCustomToast();
  
  const handleOpenModal = (jobId) => {
    setJobToDelete(jobId);
    setIsModalOpen(true);
  };

  const fetchJobs = async (query = "", page = 1, limit = 1000) => {
    const authToken = localStorage.getItem('authToken'); // Get authToken from localStorage
    try {
      const data = await fetchJobsAPI(authToken, query, page, limit);
      console.log(data); // Log the data
  
      // Filter jobs based on the query
      const filteredJobs = data.jobs.filter(job => {
        const jobString = `${job.title} ${job.description} ${job.company_name} ${job.location} ${job.skills_required.join(' ')}`.toLowerCase();
        return jobString.includes(query.toLowerCase());
      });
  
      setJobs(filteredJobs); // Set filtered jobs in state
    } catch (error) {
      setError("Error fetching jobs: " + error.message);
    }
  }; 
  
  const fetchFilteredJobs = async (employmentType = "", experience = "", page = 1, limit = 1000) => {
    const authToken = localStorage.getItem('authToken'); // Get authToken from localStorage
    try {
      const data = await fetchJobsAPI(authToken, "", page, limit); // Fetch all jobs first
      console.log(data); // Log the data
  
      // Define experience levels
      const experienceRanges = {
        "Entry-Level": [0, 0], // 0 years
        "Mid-Level": [1, 5], // 1-5 years
        "Senior-Level": [5, Infinity], // More than 5 years
      };
  
      // Filter jobs based on employmentType and experience
      const filteredJobs = data.jobs.filter(job => {
        const matchesEmploymentType = employmentType 
          ? job.employment_type.toLowerCase() === employmentType.toLowerCase() 
          : true;
  
        const matchesExperience = experience 
          ? job.experience_required >= experienceRanges[experience][0] && job.experience_required <= experienceRanges[experience][1]
          : true;
  
        return matchesEmploymentType && matchesExperience;
      });
  
      console.log(`Filtered jobs count: ${filteredJobs.length}`);
      setJobs(filteredJobs); // Set filtered jobs in state
    } catch (error) {
      setError("Error fetching jobs: " + error.message);
    }
  };
  
  const handleDelete = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await deleteJobAPI(authToken, jobToDelete);
      setJobs(jobs.filter(job => job._id !== jobToDelete)); 
      showToast("Job Deleted successfully!", "success");      
    } catch (error) {
      console.error("Error deleting job:", error);
      showToast("Job Not deleted !", "failed");    
    } finally {
      setIsModalOpen(false); 
      setJobToDelete(null); 
    }
  };
  
  // Initial fetch for all jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery); // Fetch jobs based on the search query
  };

  const handleFilterButtonClick = () => {
    const selectedEmploymentType = employmentType; // Get from your state or input
    const selectedExperience = experience; // Get from your state or input
    fetchFilteredJobs(selectedEmploymentType, selectedExperience);
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

  const displayedJobs = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div
      className="dashboard"
      style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: isModalOpen ? '#4b5563' : '#f9fafb' }} // Change background based on modal state
    >
      <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
        <SidebarBody className="flex flex-col justify-start py-9">
          <SidebarLink link={{ href: '/jobcards', label: 'Job Cards', icon: <IconBriefcase /> }} className="mb-2" />
          <SidebarLink link={{ href: '/candidates', label: 'Candidates', icon: <IconUser /> }} />
          <SidebarLink link={{ href: '/AddNewJob', label: 'Add New Job', icon:<IconPlus/>}}/>
        </SidebarBody>
      </Sidebar>
       <div className="main-content" style={{ flexGrow: 1, padding: '40px', marginLeft: '80px', transition: 'margin-left 0.3s' }}>
        <div className='filterandserch flex justify-between mb-6'>
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-4">
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Employment Type</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="intern">Intern</option>
            </select>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Experience</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior-Level">Senior-Level</option>
            </select>

            <button
              onClick={handleFilterButtonClick}
              className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
            >
              Filter
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '23px', fontWeight: 'bold', color: '#1f2937' }}>
            Current Openings ({jobs.length})
          </h1>
        </div>
        <div className="job-list" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          {displayedJobs.map(job => (
            <JobCard key={job._id} job={job} onOpenModal={handleOpenModal} />
          ))}
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
        />
        
        {!showAll && jobs.length > 3 && (
          <button
            onClick={handleSeeAll}
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fb923c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            See All
          </button> 
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fb923c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            See Less
          </button>
        )}


      </div>
    </div>
  );
};

export default JobList;
