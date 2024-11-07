import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  Filter,
} from "lucide-react";
import { deleteJobAPI, fetchJobsAPI } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";
import JobPostMain from "./JobPostMain";

export default function JobSearchPlatform() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    fullDay: false,
    flexibleSchedule: false,
    shiftWork: false,
  });
  const [salaryRange, setSalaryRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("lastUpdated");

  const { authToken, userInfo } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id) => {
    console.log("Deleting job with id:", id);
    try {
      // await deleteJobAPI(authToken, id); // Pass authToken to deleteJobAPI function
      // fetchJobsFromApi();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Editing job with id:", id);
    const job = jobs.find((job) => job._id.toString() === id);
    // setJobData(job);
    // onOpen();
  };

  const fetchJobsFromApi = async () => {
    try {
      const data = await fetchJobsAPI(authToken, searchTerm, currentPage);
      // setTotalPages(data.totalPages);
      setJobs(data.jobs);
      console.log(data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchJobsFromApi();

    // Scroll event listener for sticky div
    const handleScroll = () => {
      if (window.scrollY > 54) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div
        // backdrop-blur-md bg-opacity-75
        className={`p-4 z-10 bg-gray-100 transition-shadow duration-300 ${
          isSticky ? "sticky top-0 shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto flex flex-wrap gap-4">
          <div className="flex items-center bg-gray-900 rounded-md p-2 flex-grow">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Designer"
              className="bg-transparent text-white placeholder-white outline-none flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center bg-gray-900 rounded-md p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-white">Work location</span>
            <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
          </div>
          <div className="flex items-center bg-gray-900 rounded-md p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-white">Experience</span>
            <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
          </div>
          {/* <div className="flex items-center bg-gray-900 rounded-md p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-white">Per month</span>
            <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
          </div>
          <div className="flex items-center text-black">
            <span>Salary range</span>
            <span className="mx-2">
              ${salaryRange[0]} - ${salaryRange[1]}
            </span>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4">
              Get Your best profession with Ruthi
            </h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
              Learn more
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              Filters <Filter className="w-4 h-4 ml-2" />
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Working schedule</h4>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.fullTime}
                    // onChange={() => handleFilterChange("fullTime")}
                  />
                  Full-time
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.partTime}
                    // onChange={() => handleFilterChange("partTime")}
                  />
                  Part-time
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.internship}
                    // onChange={() => handleFilterChange("internship")}
                  />
                  Internship
                </label>
              </div>
              {/* <div>
                <h4 className="font-semibold mb-2">Employment type</h4>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.fullDay}
                    // onChange={() => handleFilterChange("fullDay")}
                  />
                  Full-day
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.flexibleSchedule}
                    // onChange={() => handleFilterChange("flexibleSchedule")}
                  />
                  Flexible schedule
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-blue-500"
                    checked={selectedFilters.shiftWork}
                    // onChange={() => handleFilterChange("shiftWork")}
                  />
                  Shift work
                </label>
              </div> */}
              {/* <div>
                <h4 className="font-semibold mb-2">Salary Range</h4>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={salaryRange[1]}
                  // onChange={(e) =>
                  //   handleSalaryRangeChange(e, [
                  //     salaryRange[0],
                  //     parseInt(e.target.value),
                  //   ])
                  // }
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span>${salaryRange[0]}</span>
                  <span>${salaryRange[1]}</span>
                </div>
              </div> */}
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Recommended jobs{" "}
              <span className="text-gray-500 text-lg">
                {/* {filteredJobs.length}  */}
                100
              </span>
            </h2>
            {/* <div className="flex items-center">
              <span className="mr-2">Sort by:</span>
              <select
                className="bg-white border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastUpdated">Last updated</option>
                <option value="salaryHighToLow">Salary: High to Low</option>
                <option value="salaryLowToHigh">Salary: Low to High</option>
              </select>
            </div> */}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 h-[80vh] overflow-y-scroll no-scrollbar">
              {jobs.map((job, index) => (
                <JobPostMain
                  key={index}
                  _id={job._id.toString()}
                  title={job.title}
                  jobLink={job.job_link}
                  companyLogoUrl={job.company_logo}
                  company={job.company_name}
                  description={job.description}
                  location={job.location}
                  employmentType={job.employment_type}
                  yearsOfExperience={job.experience_required}
                  skills={job.skills_required}
                  numberOfApplicants={1000}
                  posted_date={job.posted_date}
                  handleDelete={
                    userInfo?.role === "admin" ? handleDelete : null
                  }
                  handleEdit={userInfo?.role === "admin" ? handleEdit : null}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
