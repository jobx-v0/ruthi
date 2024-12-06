import React, { useState, useEffect } from "react";
import { fetchJobsAPI } from "../../api/jobApi";


function FilterDropdown({ selectedFilters, onFilterChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async (query = "", page = 1, limit = 1000) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetchJobsAPI(authToken, query, page, limit);
      const data = await response.json();
      console.log("Jobs from the backend filter: ", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelect = (category, option) => {
    const updatedFilters = { ...selectedFilters };
    if (category === "payRange") {
      updatedFilters[category] = option;
    } else {
      updatedFilters[category] = updatedFilters[category].includes(option)
        ? updatedFilters[category].filter((item) => item !== option)
        : [...updatedFilters[category], option];
    }
    onFilterChange(updatedFilters); // Notify parent component of the filter change
  };

  return (
    <div className="relative">
      <button onClick={(e) => {
          e.preventDefault(); 
          toggleDropdown();
        }}
        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
        Filter
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
          {["Role", "Experience", "Skills", "Engagement", "Pay Range"].map((category) => (
            <DropdownItem
              key={category}
              category={category}
              onSelect={handleSelect}
              selectedFilters={selectedFilters}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const DropdownItem = ({ category, onSelect, selectedFilters }) => {
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const options = {
    Role: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "QA Engineer", "Data Scientist"],
    Experience: ["0-2 years", "2-5 years", "5+ years"],
    Skills: ["Python", "JavaScript", "React.js", "Node.js", "AWS"],
    Engagement: ["full-time", "part-time", "Remote"],
  };

  const filteredOptions = options[category] ? options[category].filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleMouseLeave = () => {
    const id = setTimeout(() => setShowSubDropdown(false), 200);
    setTimeoutId(id);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setShowSubDropdown(true);
  };

  return (
    <div
      className="px-4 py-2 hover:bg-gray-200 cursor-pointer relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {category}
      {showSubDropdown && (
          <div className="absolute left-full top-0 ml-2 w-48 bg-white shadow-lg rounded-lg z-20">
          {(category === "Role" || category === "Skills") && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border rounded mb-2 w-full"
            />
          )}
          {filteredOptions.map((option) => (
            <div key={option} className="px-4 py-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedFilters[category.toLowerCase()]?.includes(option)}
                  onChange={() => onSelect(category.toLowerCase(), option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PayRangeSlider = ({ onSelect }) => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(200000);

  const handleChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    if (type === "min") {
      setMinValue(value);
    } else {
      setMaxValue(value);
    }
    onSelect("payRange", `$${minValue} - $${maxValue}`);
  };

  return (
    <div className="p-4">
      <label className="block font-semibold mb-2">Pay Range:</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={minValue}
          onChange={(e) => handleChange(e, "min")}
          className="w-full"
        />
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={maxValue}
          onChange={(e) => handleChange(e, "max")}
          className="w-full"
        />
      </div>
      <p className="text-sm mt-2">
        Selected Range: ${minValue} - ${maxValue}
      </p>
    </div>
  );
};

export default FilterDropdown;
