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
      className="job-card"
      onClick={handleCardClick}
      style={{
        width: "30%",
        minWidth: "300px",
        maxWidth: "380px",
        border: "none",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#ffffff",
        backgroundImage: "linear-gradient(135deg, #f3f4f6, #ffffff)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        margin: "20px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.3s",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.08)";
      }}
    >
      <div style={{ paddingBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative", // Required for absolute positioning of the icon
            marginBottom: "15px", // Add space below the flex container
          }}
        >
          <img
            src={job.company_logo}
            alt={`${job.company_name} logo`}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            }}
          />
          {/* Delete Icon */}
          <IconTrash
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigation on delete
              onOpenModal(job._id); // Open the modal with job ID
            }}
            style={{ color: "#f87171", cursor: "pointer", fontSize: "20px" }}
          />
        </div>
        {/* Posted date */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            color: "#0284c7",
            padding: "4px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          <FontAwesomeIcon icon={faClock} style={{ marginRight: "4px" }} />
          {formatPostedDate(job.posted_date)}
        </span>
        {/* Title aligned to the left */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "10px",
            textAlign: "left",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          {job.title}
        </h3>

        {/* Job Location with FontAwesome Location Icon */}
        <p
          style={{
            fontSize: "15px",
            color: "#6b7280",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ marginRight: "8px", color: "#ef4444", fontSize: "16px" }}
          />
          {job.location}
        </p>

        {/* Employment Type */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#6b7280", maxWidth: "100px" }}>
            {job.employment_type}
          </p>
          {/* "+Today" Text with Green Background */}
          <span
            style={{
              backgroundColor: "#bbf7d0",
              color: "#065f46",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            +Today
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <span
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginRight: "5px",
            color: "#1f2937",
          }}
        >
          {applicationCount}
        </span>
        <span>Applications</span>
      </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [applications, setApplications] = useState([]);
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
  //write the code to fetch the applications using the axios
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/jobApplications/all`
      );
      setApplications(response.data);
      const data2 = response.data;
      console.log("data of appli", data2);
      //continue
    } catch (error) {
      setError(error.message);
    }
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
    fetchApplications();
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
    <div
      className="dashboard"
      style={{
        display: "flex",
        width: "990px",
        minHeight: "100vh",
        margin: "0 auto",
      }} // Change background based on modal state
    >
      <div
        className="main-content"
        style={{
          flexGrow: 1,
          padding: "20px",
          transition: "margin-left 0.3s",
        }}
      >
        <div className="filterandserch flex justify-between mb-6">
          <form className="flex items-center space-x-4">
            <div className="relative w-50%">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchJobs(e.target.value);
                }}
                placeholder="Search jobs..."
                className="border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
              />
              {/* Search Icon positioned at the end of the input */}
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
            />
          </form>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{ fontSize: "23px", fontWeight: "bold", color: "#1f2937" }}
          >
            Current Openings ({jobs.length})
          </h1>
        </div>
        <div
          className="job-list"
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
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
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fb923c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f97316")
            }
          >
            See All
          </button>
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fb923c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f97316")
            }
          >
            See Less
          </button>
        )}
      </div>
    </div>
  );
};

export default JobList;
