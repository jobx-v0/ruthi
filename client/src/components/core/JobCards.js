import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from '../../ui/sidebar';
import { IconBriefcase, IconUser, IconPlus } from '@tabler/icons-react';
// JobCard Component
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
        <img
          src={job.company_logo}
          alt={`${job.company_name} logo`}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            marginBottom: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          }}
        />
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
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3004/api/jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Rendering job list...', data);
        setJobs(data.jobs);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJobs();
  }, []);

  const handleSeeAll = () => {
    setShowAll(true);
  };

  const handleAddJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setIsAddJobModalOpen(false);
  };

  const displayedJobs = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div
      className="dashboard"
      style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f9fafb' }}
    >
      <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
        <SidebarBody className="flex flex-col justify-start py-9">
          <SidebarLink link={{ href: '/jobcards', label: 'Job Cards', icon: <IconBriefcase /> }} className="mb-2" />
          <SidebarLink link={{ href: '/candidates', label: 'Candidates', icon: <IconUser /> }} />
          <SidebarLink link={{ href: '/AddNewJob', label: 'Add New Job', icon:<IconPlus/>}}/>
        </SidebarBody>
      </Sidebar>
       <div className="main-content" style={{ flexGrow: 1, padding: '40px', marginLeft: '80px', transition: 'margin-left 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '23px', fontWeight: 'bold', color: '#1f2937' }}>
            Current Openings ({jobs.length})
          </h1>
        </div>
        <div className="job-list" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          {displayedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
        {!showAll && jobs.length > 3 && (
          <button
            onClick={handleSeeAll}
            style={{
              padding: '8px 24px',
              backgroundColor: '#f97316',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              marginTop: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fb923c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
          >
            See All
          </button>
        )}
      </div>
    </div>
  );
};

export default JobList;
