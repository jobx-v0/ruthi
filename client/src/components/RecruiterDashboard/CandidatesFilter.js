import React, { useState } from "react";

function FilterDropdown({ selectedFilters, onFilterChange }) {
  const [showDropdown, setShowDropdown] = useState(false);


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
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
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

      {/* <div className="mt-4">
        <h2 className="font-bold">Selected Filters:</h2>
        {Object.entries(selectedFilters).map(([category, options]) =>
          options.length ? (
            <p key={category}>
              <span className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>{" "}
              {Array.isArray(options) ? options.join(", ") : options}
            </p>
          ) : null
        )}
      </div> */}
    </div>
  );
}

const DropdownItem = ({ category, onSelect, selectedFilters }) => {
  const [showSubDropdown, setShowSubDropdown] = useState(false);

  const options = {
    Role: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "QA Engineer","Data Scientist"],
    Experience: ["0-2 years", "2-5 years", "5+ years"],
    Skills: ["Python", "JavaScript", "React.js", "Node.js", "AWS"],
    Engagement: ["full-time", "part-time", "Remote"],
  };

  return (
    <div
      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
      onMouseEnter={() => setShowSubDropdown(true)}
      onMouseLeave={() => setShowSubDropdown(false)}
    >
      {category}
      {showSubDropdown && (
        <div className="absolute left-full top-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
          {category === "Pay Range" ? (
            <PayRangeSlider onSelect={onSelect} />
          ) : (
            options[category].map((option) => (
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
            ))
          )}
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
