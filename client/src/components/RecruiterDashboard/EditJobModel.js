import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateJobAPI, fetchJobByIdAPI } from "../../api/jobApi";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "../utils/useCustomToast";
import { jobFormSchema } from "../../validators/ZodSchema";
import { SidebarBody, SidebarLink, Sidebar } from "../../ui/sidebar";
import { IconUsers, IconList } from "@tabler/icons-react";

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
    <div className="flex h-screen">
      <Sidebar>
        <SidebarBody>
          <SidebarLink
            link={{
              href: "/MainReqDashboard",
              label: "Jobs",
              icon: <IconUsers />,
            }}
            className="mb-2 mt-2"
          />
          <SidebarLink
            link={{
              href: "/MainReqDashboard",
              label: "Candidate",
              icon: <IconList />,
            }}
            className="mb-2"
          />
        </SidebarBody>
      </Sidebar>
      <div className="w-70% flex-1 p-5 flex flex-col items-center overflow-y-auto sm:w-[90%]">
        <div className="lg:w-[70%] sm:w-[90%] w-full p-5 border border-gray-300 rounded-lg bg-white shadow-xl relative ">
          <h2 className="text-center text-2xl text-gray-900">Edit Job</h2>
          <hr className="border-gray-400 my-6 " />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="flex flex-wrap lg:items-center lg:p-2"
          >
            {/* Job Title */}
            <div className="mb-4 w-full flex lg:p-2 lg:items-center flex-col md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
                htmlFor="title"
              >
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

            {/* Company Name */}
            <div className="mb-4 w-full flex lg:p-2 lg:items-center flex-col md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
                htmlFor="company_name"
              >
                Company Name:
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
                />
                {errors.company_name && (
                  <span className="text-red-500 text-xs">
                    {errors.company_name}
                  </span>
                )}
              </div>
            </div>

            {/* Posted Date */}
            <div className="mb-4 w-full flex lg:p-2 lg:items-center flex-col md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
                htmlFor="posted_date"
              >
                Posted Date:
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
                />
                {errors.posted_date && (
                  <span className="text-red-500 text-xs">
                    {errors.posted_date}
                  </span>
                )}
              </div>
            </div>

            {/* Experience Required */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
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

            {/* Location */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
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
                  <span className="text-red-500 text-xs">
                    {errors.location}
                  </span>
                )}
              </div>
            </div>

            {/* Skills Required */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
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

            {/* Job Link */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
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
                  <span className="text-red-500 text-xs">
                    {errors.job_link}
                  </span>
                )}
              </div>
            </div>

            {/* Company Logo */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
                htmlFor="company_logo"
              >
                Company Logo (URL):
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
                />
                {errors.company_logo && (
                  <span className="text-red-500 text-xs">
                    {errors.company_logo}
                  </span>
                )}
              </div>
            </div>

            {/* Employment Type */}
            <div className="mb-4 w-full flex flex-col lg:p-2 lg:items-center md:flex-row md:w-1/2">
              <label
                className="text-sm text-gray-700 mb-2 md:mb-0 md:w-48"
                htmlFor="employment_type"
              >
                Employment Type:
              </label>
              <div className="flex items-center justify-start sm:justify-center space-x-4 flex-wrap">
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

            <div className="mb-4 w-full flex flex-col">
              <label
                className="text-sm text-gray-700 mb-2"
                htmlFor="description"
              >
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
                        <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-gray-700"
                        value={item.question}
                        onChange={(e) => {
                          const updatedCustomInterview = [
                            ...jobData.custom_interview,
                          ];
                          updatedCustomInterview[index].question =
                            e.target.value;
                          setJobData({
                            ...jobData,
                            custom_interview: updatedCustomInterview,
                          });
                        }}
                        required
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
