import { useEffect, useState, useRef } from "react";
import ProfileCard from "./profileCard";
import FilterDropdown from "./CandidatesFilter";
import axios from "axios";
import { IconSearch } from "@tabler/icons-react";

const stageBadgeColors = {
  Applied: "#ab21df12",
  Shortlisted: "#4B008212",
  Screening: "#4b78f112",
  Interview: "#ede23712",
  Rejected: "#df214712",
};

const CandidatesApplied = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateRange, setDateRange] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State for selected candidate
  const [candidates, setCandidates] = useState([]);
  const profileCardRef = useRef(null);
  const [displayFilters, setDisplayFilters] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const [filters, setFilters] = useState({
    role: [],
    experience: [],
    skills: [],
    engagement: [],
    payRange: "",
  });
  const isSmallOrMediumScreen = window.innerWidth <= 768; // Example: Adjust breakpoints as needed

  useEffect(() => {
    //log data
    console.log("Fetching candidates from API...");
    const getCandidates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/jobApplications/all`
        );
        const data = response.data;
        console.log("Data from API", data);
        setCandidates(data.appliedApplications);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    getCandidates();
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("Updated candidates:", candidates);
  }, [candidates]);

  const updateCandidateStage = (_id, applicationStage) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate._id === _id ? { ...candidate, applicationStage } : candidate
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to calculate the start date based on the selected range
  const getStartDateForRange = (range) => {
    const currentDate = new Date();
    switch (range) {
      case "last30":
        return new Date(currentDate.setDate(currentDate.getDate() - 30));
      case "last60":
        return new Date(currentDate.setDate(currentDate.getDate() - 60));
      case "last90":
        return new Date(currentDate.setDate(currentDate.getDate() - 90));
      default:
        return null; // Return a very old date if no range selected
    }
  };
  const handleCheckboxChange = (index) => {
    setSelectedCandidate((prevSelected) => {
      // If the candidate is already selected, remove it
      if (prevSelected === index) {
        return null;
      }
      // Otherwise, select the candidate at the given index
      return index;
    });
  };
  const filteredCandidates = candidates
    .filter((candidate) => {
      // Check if candidate matches the role filter
      if (filters.role.length && !filters.role.includes(candidate.appliedRole))
        return false;

      // // Check if candidate matches the experience, engagement, and payRange filters (add conditions based on your structure)
      // if (filters.engagement && candidate !== filters.experience) return false;
      // if (filters.payRange && candidate.payRange < filters.payRange.min || candidate.payRange > filters.payRange.max) return false;

      // Check if candidate has all the required skills in selectedSkills
      if (
        !filters.skills.every((skill) =>
          candidate.skills.some(
            (candidateSkill) => candidateSkill.name === skill
          )
        )
      )
        return false;

      // Filter based on date range
      const appliedDate = new Date(candidate.appliedDate);
      const startDate = getStartDateForRange(dateRange);
      if (appliedDate < startDate) return false;

      return true;
    })
    .filter((candidate) =>
      `${candidate.userName} ${candidate.appliedRole}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.userName.localeCompare(b.userName)
        : b.userName.localeCompare(a.userName)
    );

  console.log(filteredCandidates);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //write function formatting appliedDate
  function formatAppliedDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[monthIndex];

    return `${day} ${month}, ${year}`;
  }

  //Load Image
  const array = [
    " https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png",
  ];

  //filter by Role, Experience, slary, stage["Applied","Screening","Hired","Interview","Rejected"]

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const StageStyling = ({ applicationStage }) => {
    const style = {
      fontWeight: "bold",
      padding: "0.2rem 0.5rem", // Adjusted padding
      borderRadius: "0.375rem",
    };
    switch (applicationStage) {
      case "Applied":
        return (
          <span
            className={`whitespace-nowrap`}
            style={{
              ...style,
              border: `2px solid #ab21df`,
              color: "#ab21df",
              backgroundColor: `#ab21df12`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      case "Profile Screening":
        return (
          <span
            className={`whitespace-nowrap`}
            style={{
              ...style,
              border: `2px solid #6A0DAD`,
              color: "#6A0DAD",
              backgroundColor: `#6A0DAD12`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      case "Shortlisted":
        return (
          <span
            className={`px-2 py-1 rounded`}
            style={{
              border: `2px solid #4B0082`,
              color: "#4B0082",
              backgroundColor: `#4B008212`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      case "Interview 1":
        return (
          <span
            className={`px-2 py-1 rounded`}
            style={{
              border: `2px solid #28A745`,
              color: "#28A745",
              backgroundColor: `#28A74512`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      case "Interview 2":
        return (
          <span
            className={`px-2 py-1 rounded`}
            style={{
              border: `2px solid #006400`,
              color: "#006400",
              backgroundColor: `#00640012`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      case "Final Interview":
        return (
          <span
            className={`px-2 py-1 rounded`}
            style={{
              border: `2px solid #008080`,
              color: "#008080",
              backgroundColor: `#00808012`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
      default:
        return (
          <span
            className={`px-2 py-1 rounded`}
            style={{
              border: `2px solid #ab21df`,
              color: "#ab21df",
              backgroundColor: `#ab21df12`,
              fontWeight: "bold",
            }}
          >
            {applicationStage}
          </span>
        );
    }
  };

  return (
    <>
      {selectedCandidate && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-40 z-10"
            onClick={() => setSelectedCandidate(null)}
          ></div>
          {/* <div className="sidebar fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 z-10"> */}
          <div
            className={`fixed ${
              isSmallOrMediumScreen
                ? "bottom-0 w-full h-9/10 translate-y-[2%]"
                : "top-0 right-0 w-1/3 h-full"
            } bg-white shadow-lg p-4 z-20 transition-transform transform ${
              selectedCandidate ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <ProfileCard
              candidate={selectedCandidate}
              StageStyling={StageStyling}
              formatAppliedDate={formatAppliedDate}
              updateCandidateStage={updateCandidateStage}
              onClose={() => setSelectedCandidate(null)}
            />
          </div>
        </>
      )}
      <div className={`container mx-auto p-4 space-y-4`}>
        {/* Sidebar for Selected Candidate Details */}
        <h1 className="heading">Candidates</h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* filter candidates */}
          <div className="flex flex-wrap justify-end items-center gap-2">
            <FilterDropdown
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
            />
            {/* Sort and Date Range */}

            <select
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded"
              value={sortOrder}
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>

            <select
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded"
              value={dateRange}
            >
              <option value="None" selected>
                None
              </option>
              <option value="last30">Last 30 days</option>
              <option value="last60">Last 60 days</option>
              <option value="last90">Last 90 days</option>
            </select>

            <button className="px-4 py-2 border hidden md:block border-gray-300 rounded bg-gray-100">
              Export Data
            </button>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto">
          {filteredCandidates.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <img
                src="https://cdn2.iconfinder.com/data/icons/delivery-and-logistic/64/Not_found_the_recipient-no_found-person-user-search-searching-4-1024.png"
                alt="No candidates"
                className="w-32 h-32 mb-4"
              />
              <h2 className="text-lg font-semibold">No Candidates Found</h2>
            </div>
          ) : (
            <table className="w-full border border-gray-200 text-[8px] sm:text-xs md:text-sm lg:text-base">
              <thead className="bg-gray-200">
                <tr>
                  {/* <th className="px-4 py-2">Select</th> */}
                  <th className="px-4 py-2 text-xs text-[5px] sm:text-xs md:text-sm lg:text-base">
                    Applied Role
                  </th>
                  <th className="px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg">
                    Candidates
                  </th>
                  <th className="px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg hidden md:table-cell">
                    Applied Date
                  </th>
                  <th className="px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-t cursor-pointer hover:bg-gray-200"
                    onClick={() => handleCheckboxChange(candidate)}
                  >
                    {/* <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(candidate)}
                      />
                    </td> */}
                    <td className="px-4 py-2 text-blue-500 font-bold text-[8px] sm:text-xs md:text-sm lg:text-base truncate">
                      {candidate.appliedRole}
                    </td>
                    <td className="px-4 py-2 text-black hidden md:table-cell">
                      {candidate.appliedLocation}
                    </td>
                    <td className="px-4 py-2 flex items-center text-black text-[10px] sm:text-xs md:text-sm lg:text-base">
                      <img
                        src={array[0]}
                        alt={`${candidate.userName}'s avatar`}
                        className="w-6 h-6 hidden sm:table-cell sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-5"
                      />
                      <div className="sm:ml:5">
                        <div className="font-medium text-black text-[10px] sm:text-xs md:text-sm lg:text-base truncate">
                          {candidate.userName}
                        </div>
                        <div className="text-sm text-gray-500 text-[10px] hidden sm:table-cell sm:text-xs md:text-sm lg:text-base truncate">
                          {candidate.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-black hidden md:table-cell">
                      {candidate.userPhone}
                    </td>
                    <td className="px-4 py-2 text-black hidden md:table-cell">
                      {formatAppliedDate(candidate.appliedDate)}
                    </td>
                    <td className=" text-black text-[10px] sm:text-xs md:text-sm lg:text-base">
                      <StageStyling
                        applicationStage={candidate.applicationStage}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatesApplied;
