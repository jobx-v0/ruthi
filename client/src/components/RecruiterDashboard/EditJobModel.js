import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateJobAPI, fetchJobByIdAPI } from "../../api/jobApi";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "../utils/useCustomToast";
import { jobFormSchema } from "../../validators/ZodSchema";

const EditJobModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const [errors, setErrors] = useState({});

  const [jobData, setJobData] = useState({
    title: "",
    company_name: "",
    posted_date: "",
    employment_type: "",
    experience_required: "",
    location: "",
    description: "",
    skills_required: [],
    job_link: "",
    company_logo: "",
  });

  useEffect(() => {
    const fetchJobData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const jobDetails = await fetchJobByIdAPI(token, id);
        setJobData(jobDetails);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobData();
  }, [id]);

  const validateField = (name, value) => {
    try {
      jobFormSchema.shape[name].parse(value); // Validate the field using its schema
      setErrors((prev) => ({ ...prev, [name]: null })); // Clear any existing errors for this field
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error.errors[0].message, // Set the error message for the field
      }));
    }
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await updateJobAPI(token, id, jobData);
      showToast("Job updated successfully!", "success");
      navigate(`/JobDescription/${id}`);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };
  return (
    <div className="flex h-screen justify-center w-full items-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-5xl p-6 max-h-[900px] overflow-hidden ">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Edit Job
        </h2>
        <hr className="border-gray-400 mb-6" />
        <div className="overflow-y-auto max-h-[600px] scrollbar-hide">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-wrap"
        >
          <div className="mb-4 w-full md:w-1/2 pr-2 flex items-center">
            <label className="w-48 text-sm text-gray-700 mb-1" htmlFor="title">
              Job Title:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="title"
                value={jobData.title}
                onChange={(e) => {
                  setJobData({ ...jobData, title: e.target.value });
                  validateField("title", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.title ? "border-red-500" : ""
                }`}
                required
              />
              {errors.title && (
                <span className="text-red-500 text-xs">{errors.title}</span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pl-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="company_name"
            >
              Company Name:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="company_name"
                value={jobData.company_name}
                onChange={(e) => {
                  setJobData({ ...jobData, company_name: e.target.value });
                  validateField("company_name", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.company_name ? "border-red-500" : ""
                }`}
                required
              />
              {errors.company_name && (
                <span className="text-red-500 text-xs">
                  {errors.company_name}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pr-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="posted_date"
            >
              Posted Date:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="date"
                id="posted_date"
                value={jobData.posted_date.split("T")[0]}
                onChange={(e) => {
                  setJobData({ ...jobData, posted_date: e.target.value });
                  validateField("posted_date", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.posted_date ? "border-red-500" : ""
                }`}
                required
              />
              {errors.posted_date && (
                <span className="text-red-500 text-xs">
                  {errors.posted_date}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pl-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="employment_type"
            >
              Employment Type:<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              {["full-time", "part-time", "intern"].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="employment_type"
                    value={type}
                    checked={jobData.employment_type === type}
                    onChange={(e) =>
                      setJobData({
                        ...jobData,
                        employment_type: e.target.value,
                      })
                    }
                    className="mr-2"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pr-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="experience_required"
            >
              Experience Required:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="number"
                id="experience_required"
                value={jobData.experience_required}
                onChange={(e) => {
                  setJobData({
                    ...jobData,
                    experience_required: e.target.value,
                  });
                  validateField("experience_required", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.experience_required ? "border-red-500" : ""
                }`}
                required
              />
              {errors.experience_required && (
                <span className="text-red-500 text-xs">
                  {errors.experience_required}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pl-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="location"
            >
              Location:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="location"
                value={jobData.location}
                onChange={(e) => {
                  setJobData({ ...jobData, location: e.target.value });
                  validateField("location", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.location ? "border-red-500" : ""
                }`}
                required
              />
              {errors.location && (
                <span className="text-red-500 text-xs">{errors.location}</span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pr-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="skills_required"
            >
              Skills Required (comma separated):
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="text"
                id="skills_required"
                value={jobData.skills_required.join(", ")}
                onChange={(e) => {
                  setJobData({
                    ...jobData,
                    skills_required: e.target.value
                      .split(",")
                      .map((skill) => skill.trim()),
                  });
                  validateField("skills_required", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.skills_required ? "border-red-500" : ""
                }`}
                required
              />
              {errors.skills_required && (
                <span className="text-red-500 text-xs">
                  {errors.skills_required}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pl-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="job_link"
            >
              Job Link:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="url"
                id="job_link"
                value={jobData.job_link}
                onChange={(e) => {
                  setJobData({ ...jobData, job_link: e.target.value });
                  validateField("job_link", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.job_link ? "border-red-500" : ""
                }`}
                required
              />
              {errors.job_link && (
                <span className="text-red-500 text-xs">{errors.job_link}</span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full md:w-1/2 pr-2 flex items-center">
            <label
              className="w-48 text-sm text-gray-700 mb-1"
              htmlFor="company_logo"
            >
              Company Logo URL:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <input
                type="url"
                id="company_logo"
                value={jobData.company_logo}
                onChange={(e) => {
                  setJobData({ ...jobData, company_logo: e.target.value });
                  validateField("company_logo", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.company_logo ? "border-red-500" : ""
                }`}
                required
              />
              {errors.company_logo && (
                <span className="text-red-500 text-xs">
                  {errors.company_logo}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full flex flex-col">
            <label className="text-sm text-gray-700 mb-2" htmlFor="description">
              Description:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-full">
              <textarea
                id="description"
                value={jobData.description}
                onChange={(e) => {
                  setJobData({ ...jobData, description: e.target.value });
                  validateField("description", e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                  errors.description ? "border-red-500" : ""
                }`}
                required
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 w-full flex flex-col">
            <label
              className="text-sm text-gray-700 mb-2"
              htmlFor="custom_interview"
            >
              Custom Interview Questions:
            </label>
            <div className="flex flex-col w-full">
              {jobData.custom_interview &&
              jobData.custom_interview.length > 0 ? (
                jobData.custom_interview.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 mb-2 border rounded-md shadow-sm bg-gray-50"
                  >
                    <div className="text-sm font-semibold text-gray-800">
                      Question {index + 1}:
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md text-gray-700"
                      value={item.question}
                      onChange={(e) => {
                        const updatedCustomInterview = [
                          ...jobData.custom_interview,
                        ];
                        updatedCustomInterview[index].question = e.target.value;
                        setJobData({
                          ...jobData,
                          custom_interview: updatedCustomInterview,
                        });
                      }}
                    />
                    <div className="text-sm font-semibold text-gray-800 mt-2">
                      Answer:
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md text-gray-700"
                      value={item.answer}
                      onChange={(e) => {
                        const updatedCustomInterview = [
                          ...jobData.custom_interview,
                        ];
                        updatedCustomInterview[index].answer = e.target.value;
                        setJobData({
                          ...jobData,
                          custom_interview: updatedCustomInterview,
                        });
                      }}
                    />
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">
                  No custom interview questions available.
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6 w-full">
            <button
              type="button"
              onClick={() => navigate(`/JobDescription/${id}`)}
              className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleUpdate}
              className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-400"
            >
              Update Job
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default EditJobModel;
