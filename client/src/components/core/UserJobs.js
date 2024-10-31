import React, { useEffect, useState } from "react";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs"); // Update with your API endpoint
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    try {
      await axios.post(`/api/jobs/${jobId}/apply`); // API endpoint to apply for a job
      alert("Successfully applied for the job!");
      // Optional: You can also update the local state if needed
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job.");
    }
  };

  return (
    <div>
      <h1>Jobs</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Filters can be added here */}
      <div className="job-cards">
        {jobs
          .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(job => (
            <div key={job._id} className="job-card">
              <h2>{job.title}</h2>
              <p>Company: {job.company_name}</p>
              <p>Location: {job.location}</p>
              <p>Description: {job.description}</p>
              <button onClick={() => applyJob(job._id)}>Apply</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Jobs;
