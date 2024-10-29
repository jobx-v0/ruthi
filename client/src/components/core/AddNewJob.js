import { z } from "zod";
import { Sidebar, SidebarBody, SidebarLink } from '../../ui/sidebar';
import { IconBriefcase, IconUser, IconPlus } from '@tabler/icons-react';
import axios from 'axios'; 
import { useState } from 'react';
import { useCustomToast } from "../utils/useCustomToast"; // Import the custom hook

// Define the job schema
const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  job_link: z.string().url("Invalid job link"),
  employment_type: z.enum(["full-time", "part-time", "contract"], {
    errorMap: () => ({ message: "Invalid employment type" }),
  }),
  location: z.string().min(1, "Location is required"),
  skills_required: z.string().optional(),
  experience_required: z.number().min(0, "Experience required must be at least 0"),
  company_name: z.string().min(1, "Company name is required"),
  company_logo: z.string().url("Invalid URL for company logo"),
  description: z.string().min(1, "Job description is required"),
});

const BACKEND_URL = "YOUR_BACKEND_URL_HERE"; // Define your backend URL
const authToken = "YOUR_AUTH_TOKEN_HERE"; // Retrieve this from your auth context or state

const JobForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    job_link: "",
    employment_type: "full-time",
    location: "",
    skills_required: "",
    experience_required: 0,
    company_name: "",
    company_logo: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showToast = useCustomToast(); // Initialize showToast from custom hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    try {
      jobSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Start loading state
    try {
      // Prepare the data to be submitted
      const jobDataToSubmit = { ...formData };

      // Check for missing required fields
      const requiredFields = [
        'title',
        'description',
        'job_link',
        'employment_type',
        'location',
        'company_name'
      ];

      const missingFields = requiredFields.filter(field => !jobDataToSubmit[field]);

      if (missingFields.length > 0) {
        const missingFieldsMessage = missingFields.join(", ");
        showToast(`Please fill in the required fields: ${missingFieldsMessage}`, "error");
        setIsLoading(false);
        return;
      }

      console.log("Data being submitted:", JSON.stringify(jobDataToSubmit, null, 2));

      // Make the API call to add the new job
      const response = await axios.post(
        `${BACKEND_URL}/api/jobs`,
        jobDataToSubmit,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("Job added successfully:", response.data);
      showToast("Job submitted successfully!", "success");

      // Reset form fields after successful submission
      resetForm();
      setSubmitted(true); // Set submission state to true

    } catch (error) {
      console.error("Error submitting job:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        showToast(`Failed to submit job: ${error.response.data.message || "Unknown error"}`, "error");
      } else {
        showToast("Failed to submit job. Please try again.", "error");
      }
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      job_link: "",
      employment_type: "full-time",
      location: "",
      skills_required: "",
      experience_required: 0,
      company_name: "",
      company_logo: "",
    });
    setErrors({});
    setSubmitted(false); // Reset submitted state
  };

  // Convert skills to an array for display
  const skillsArray = formData.skills_required.split(",").map(skill => skill.trim()).filter(skill => skill);

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
        <SidebarBody className="flex flex-col justify-start py-9">
          <SidebarLink link={{ href: '/jobcards', label: 'Job Cards', icon: <IconBriefcase /> }} className="mb-2" />
          <SidebarLink link={{ href: '/candidates', label: 'Candidates', icon: <IconUser /> }} />
          <SidebarLink link={{ href: '/AddNewJob', label: 'Add New Job', icon: <IconPlus /> }} />
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 p-5 flex justify-center items-center">
        <div className="w-full max-w-[70%] p-5 border border-gray-300 rounded-lg bg-white shadow-xl relative">
          <h2 className="text-center text-2xl text-gray-800">Add New Job</h2>
          <hr className="my-4 border-gray-300" />
          {!submitted ? (
            <form onSubmit={handleJobSubmit} className="flex flex-col">
              {[
                { label: "Title", name: "title", type: "text" },
                { label: "Job Link", name: "job_link", type: "url" },
                { label: "Experience Required (years)", name: "experience_required", type: "number" },
                { label: "Company Name", name: "company_name", type: "text" },
                { label: "Company Logo URL", name: "company_logo", type: "url" },
                { label: "Location", name: "location", type: "text" },
              ].map((field, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <label className="w-48 text-sm text-gray-600">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`flex-1 p-2 text-sm border border-gray-300 rounded ${errors[field.name] ? 'border-red-500' : ''}`}
                  />
                  {errors[field.name] && (
                    <span className="text-red-500 text-xs mt-1">{errors[field.name]}</span>
                  )}
                </div>
              ))}
              <div className="flex flex-col mb-4">
                <label className="w-48 text-sm text-gray-600">Skills Required</label>
                <input
                  type="text"
                  name="skills_required"
                  value={formData.skills_required}
                  onChange={handleChange}
                  placeholder="Comma-separated skills"
                  className={`flex-1 p-2 text-sm border border-gray-300 rounded ${errors.skills_required ? 'border-red-500' : ''}`}
                />
                {errors.skills_required && (
                  <span className="text-red-500 text-xs mt-1">{errors.skills_required}</span>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="w-48 text-sm text-gray-600">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`flex-1 p-2 text-sm border border-gray-300 rounded ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                )}
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Job"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h3 className="text-lg text-green-600">Job submitted successfully!</h3>
              <button
                onClick={resetForm}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Add Another Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobForm;
