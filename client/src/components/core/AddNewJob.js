import { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '../../ui/sidebar'; // Adjust the import path as needed
import { IconBriefcase, IconUser, IconPlus } from '@tabler/icons-react';
import { useCustomToast } from "../utils/useCustomToast"; 
import { addJobAPI } from "../../api/jobApi"; // Adjust the import path as needed

const JobForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    job_link: "",
    employment_type: "full-time",
    location: "",
    skills_required: [],
    experience_required: "",
    company_name: "",
    company_logo: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showToast = useCustomToast();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
  }, []);

  const getPostDate = () => {
    return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    switch (name) {
      case "skills_required":
        const skillsArray = value.split(",").map(skill => skill.trim());
        setFormData((prev) => ({ ...prev, [name]: skillsArray }));
        break;
  
      case "experience_required":
        const experienceValue = Number(value);
        setFormData((prev) => ({ ...prev, [name]: experienceValue }));
        break;
  
      case "employment_type":
      case "title":
      case "description":
      case "job_link":
      case "location":
      case "company_name":
      case "company_logo":
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
  
      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
    }
  };
  const getDescriptionPoints = () => {
    return formData.description.split('\n').filter(point => point.trim() !== '');
  };
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addJobAPI(authToken, formData);
      setSubmitted(true);
      showToast("Job added successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add job. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      job_link: "",
      employment_type: "full-time",
      location: "",
      skills_required: [],
      experience_required: 0,
      company_name: "",
      company_logo: "",
    });
    setErrors({});
    setSubmitted(false);
  };

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
          <h2 className="text-center text-2xl text-gray-900">Add New Job</h2>
          <hr className="my-4 border-gray-500" />
          {!submitted ? (
            <form onSubmit={handleJobSubmit} className="flex flex-col">
              <div className="flex items-center space-x-2">
              <label
                htmlFor="postedDate"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Posting Date:
              </label>
              <input
                type="date"
                id="postedDate"
                name="posted_date"
                className="w-40 px-3 py-2 rounded-md shadow-sm "
                value={getPostDate()} // Automatically set the post date
                readOnly
              />
              </div>
              <div className='one flex space-x-4 mb-4'>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Title<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Job Name"
                    style={{ fontSize: '0.875rem' }}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Job Link:</label>
                  <input
                    type="url"
                    name="job_link"
                    value={formData.job_link}
                    onChange={handleChange}
                    placeholder="https://.."
                    style={{ fontSize: '0.875rem' }}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
              </div>

              <div className='one flex space-x-4 mb-4'>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Experience Required (years)<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="experience_required"
                    value={formData.experience_required}
                    onChange={handleChange}
                    placeholder="0"
                    style={{ fontSize: '0.875rem' }}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Company Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Your Organization Name"
                    style={{ fontSize: '0.875rem' }}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
              </div>

              <div className='one flex space-x-4 mb-4'>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Company Logo URL:</label>
                  <input
                    type="url"
                    name="company_logo"
                    value={formData.company_logo}
                    placeholder="https://.."
                    style={{ fontSize: '0.875rem' }}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">Location<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    placeholder=""
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm "
                    required
                  />
                </div>
              </div>
              <div className='flex space-x-4 mb-4'>
              <div className="flex items-center w-1/2"> 
                <label className="w-48 text-sm text-gray-900">Skills Required<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="skills_required"
                  value={formData.skills_required.join(", ")} 
                  onChange={handleChange}
                  placeholder="Comma-separated values"
                  style={{ fontSize: '0.875rem' }}
                  className="w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              
              <div className="flex items-center w-1/2"> 
                <label className="w-48 text-sm text-gray-900">Employment Type<span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-4"> 
                  {["full-time", "part-time", "intern"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="employment_type"
                        value={type}
                        checked={formData.employment_type === type}
                        onChange={handleChange}
                        className="mr-2" 
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)} 
                    </label>
                  ))}
                </div>
              </div>
            </div>

              <div className="flex flex-col mb-4">
                <label className="w-48 text-sm text-gray-900">Job Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your Job"
                  style={{ fontSize: '0.875rem' }}
                  className="flex-1 p-2 text-sm border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mt-4">
              <ul className="list-disc list-inside">
                {getDescriptionPoints().map((point, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
              <div className="flex justify-center mt-4">
              <button 
                type="submit"
                className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Add Job"}
              </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h3 className="text-lg text-green-600">Job added successfully!</h3>
              <button
                onClick={resetForm}
                className="bg-orange-500 text-white mt-5 font-semibold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
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
