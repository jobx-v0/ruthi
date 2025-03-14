import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { fetchJobsAPI, deleteJobAPI } from "../../api/jobApi";
import ConfirmationModal from "./ConfirmDeleteCard";
import { useCustomToast } from "../utils/useCustomToast";
import FilterDropdown from "./CandidatesFilter";

const JobCard = ({ job, onOpenModal, applicationCount }) => {
  const navigate = useNavigate();

  const formatPostedDate = (date) => {
    const postedDate = new Date(date);
    const now = new Date();
    const secondsAgo = Math.floor((now - postedDate) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(secondsAgo / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  const handleCardClick = () => {
    navigate(`/JobDescription/${job._id}`);
  };
  return (
    <div
      className="job-card w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 min-w-[300px] max-w-[380px] border-none rounded-xl p-5 bg-gradient-to-br from-gray-100 to-white shadow-lg my-5 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden hover:translate-y-[-4px] hover:shadow-xl"
      onClick={handleCardClick}
    >
      <div className="pb-4">
        <div className="flex justify-between items-center relative mb-4">
          <img
            src={job.company_logo}
            alt={`${job.company_name} logo`}
            className="w-10 h-10  rounded-md shadow-md"
          />
          <IconTrash
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(job._id);
            }}
            className="text-red-500 cursor-pointer text-xl"
          />
        </div>
        <span className="flex items-center text-blue-600 p-1 rounded-md text-xs font-bold">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          {formatPostedDate(job.posted_date)}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-left overflow-hidden text-ellipsis whitespace-nowrap">
          {job.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="mr-2 text-red-500 text-lg"
          />
          {job.location}
        </p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-600 max-w-[100px]">
            {job.employment_type}
          </p>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            +Today
          </span>
        </div>
      </div>

      <div
        className="flex items-center"
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering the card click
        }}
      >
        <a
          href={`/CandidatesApplied?jobId=${job._id}`} // Pass the job ID as a query parameter
          className="flex items-center hover:text-blue-500 transition-colors"
        >
          <span className="text-2xl font-bold text-gray-900 mr-2">
            {applicationCount}
          </span>
          <span className="text-gray-600">Applications</span>
        </a>
      </div>
    </div>
  );
};

// JobList Component
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const showToast = useCustomToast();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    role: [],
    experience: [],
    skills: [],
    engagement: [],
    payRange: "",
  });
  const handleOpenModal = (jobId) => {
    setJobToDelete(jobId);
    setIsModalOpen(true);
  };

  const fetchJobs = async (query = "", page = 1, limit = 1000) => {
    const authToken = localStorage.getItem("authToken"); // Get authToken from localStorage
    try {
      const data = await fetchJobsAPI(authToken, query, page, limit);
      console.log(data, "jobs data"); // Log the data

      // Filter jobs based on the query and the selected filters
      const filteredJobs = data.jobs.filter((job) => {
        let isMatch = true;

        // Apply search query filter
        if (query && !job.title.toLowerCase().includes(query.toLowerCase())) {
          isMatch = false;
        }

        // Apply filters for role, experience, skills, engagement, and payRange
        if (filters.role.length && !filters.role.includes(job.role)) {
          isMatch = false;
        }

        if (
          filters.experience.length &&
          !filters.experience.includes(job.experience_required)
        ) {
          isMatch = false;
        }

        if (
          filters.skills.length &&
          !filters.skills.some((skill) => job.skills_required.includes(skill))
        ) {
          isMatch = false;
        }

        if (
          filters.engagement.length &&
          !filters.engagement.includes(job.engagement)
        ) {
          isMatch = false;
        }

        if (filters.payRange && job.payRange !== filters.payRange) {
          isMatch = false;
        }

        return isMatch;
      });
      setJobs(filteredJobs); // Set filtered jobs in state
    } catch (error) {
      setError("Error fetching jobs: " + error.message);
    }
  };

  const handleDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await deleteJobAPI(authToken, jobToDelete);
      setJobs(jobs.filter((job) => job._id !== jobToDelete));
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
    fetchJobs(searchQuery, 1, 1000, filters);
  }, [filters]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    fetchJobs(searchQuery, 1, 1000, updatedFilters); // Fetch jobs based on updated filters
  };
  const handleSeeAll = () => {
    setShowAll(true);
  };

  const displayedJobs = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div className="dashboard flex flex-col lg:flex-row w-full max-w-5xl min-h-screen mx-auto">
      <div className="main-content flex-grow p-5 transition-all">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            Current Openings ({jobs.length})
          </h1>
        </div>
        <div className="filterandsearch flex flex-col sm:flex-row justify-between mb-6">
          <form className="flex items-center space-x-4 w-full">
            <div className="relative w-20% sm:w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchJobs(e.target.value);
                }}
                placeholder="Search jobs..."
                className="border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
              <IconSearch
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
            <button
              type="button"
              onClick={() => navigate("/AddNewJob")}
              className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            >
              Add New Job
            </button>
            <FilterDropdown
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              className="absolute top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 max-h-64 overflow-y-auto"
            />
          </form>
        </div>
        <div className="job-list flex flex-wrap gap-5 mt-4">
          {displayedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onOpenModal={handleOpenModal}
              applicationCount={job.applicationCount}
            />
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
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300 mt-6"
          >
            See All
          </button>
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300 mt-6"
          >
            See Less
          </button>
        )}
      </div>
    </div>
  );
};

export default JobList;
