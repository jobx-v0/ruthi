import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Briefcase,
  PlusCircle,
  ChevronRight,
  Search,
  ChevronUp,
  Pencil,
  Trash,
} from "lucide-react";
import Ruthi_full_Logo from "../../../assets/Ruthi_full_Logo.png";
import { v4 as uuidv4 } from 'uuid'; // Add this import for generating unique IDs

export default function RecruiterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      applicants: 150,
      posted: "2023-05-01",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      applicants: 89,
      posted: "2023-05-03",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 4,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 5,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 6,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 7,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 8,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 9,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
    {
      id: 10,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applicants: 76,
      posted: "2023-05-05",
    },
  ]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleAddJob = (newJob) => {
    setJobs([
      ...jobs,
      {
        ...newJob,
        id: jobs.length + 1,
        applicants: 0,
        posted: new Date().toISOString().split("T")[0],
      },
    ]);
    setIsAddJobModalOpen(false);
  };

  const handleEditJob = (editedJob) => {
    setJobs(jobs.map((job) => (job.id === editedJob.id ? editedJob : job)));
    setSelectedJob(editedJob);
    setIsEditJobModalOpen(false);
  };

  const handleDeleteJob = () => {
    setJobs(jobs.filter((job) => job.id !== selectedJob.id));
    setSelectedJob(null);
    setIsDeleteModalOpen(false);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 flex z-40 lg:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <img className="h-8 w-auto" src={Ruthi_full_Logo} alt="Ruthi" />
          </div>
          <SidebarContent setIsAddJobModalOpen={setIsAddJobModalOpen} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white">
              <img className="h-8 w-auto" src={Ruthi_full_Logo} alt="Ruthi" />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <SidebarContent setIsAddJobModalOpen={setIsAddJobModalOpen} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search jobs or applicants"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Job Listings */}
              <div className="py-4">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Job Title
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Department
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Location
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Applicants
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Posted Date
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentJobs.map((job) => (
                              <tr
                                key={job.id}
                                className={
                                  job.id === selectedJob?.id
                                    ? "bg-indigo-50"
                                    : ""
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {job.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {job.department}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {job.location}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {job.applicants}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {job.posted}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => setSelectedJob(job)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setIsEditJobModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                  >
                                    <Pencil className="h-4 w-4 inline" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash className="h-4 w-4 inline" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-4">
                {Array.from(
                  { length: Math.ceil(jobs.length / jobsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-orange-600 text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>

              {/* Selected Job Details and Applicants */}
              {selectedJob && (
                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedJob.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {selectedJob.department} • {selectedJob.location}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Total Applicants
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedJob.applicants}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Posted Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedJob.posted}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Applicants
                      </h4>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Showing the 5 most recent applicants
                      </p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {[...Array(5)].map((_, index) => (
                        <li key={index} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              Applicant {index + 1}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                New
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <User
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                Applied on {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <ChevronRight
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <p>View application</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Job Modal */}
      {isAddJobModalOpen && (
        <JobModal
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          onSubmit={handleAddJob}
          title="Add New Job"
          buttonText="Add Job"
        />
      )}

      {/* Edit Job Modal */}
      {isEditJobModalOpen && (
        <JobModal
          isOpen={isEditJobModalOpen}
          onClose={() => setIsEditJobModalOpen(false)}
          onSubmit={handleEditJob}
          title="Edit Job"
          buttonText="Save Changes"
          initialData={selectedJob}
        />
      )}

      {/* Delete Job Modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteJob}
          jobTitle={selectedJob?.title}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 z-50"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

function SidebarContent({ setIsAddJobModalOpen }) {
  return (
    <nav className="mt-5 flex-1 px-2 bg-white">
      <a
        href="#"
        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900"
      >
        <Briefcase
          className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500"
          aria-hidden="true"
        />
        Jobs
      </a>
      <a
        href="#"
        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        onClick={() => setIsAddJobModalOpen(true)}
      >
        <PlusCircle
          className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        Post a Job
      </a>
    </nav>
  );
}

function JobModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  buttonText,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    id: initialData.id || uuidv4(), // Generate a unique ID if not provided
    title: initialData.title || '',
    jobLink: initialData.jobLink || '',
    company: initialData.company || '',
    companyLogoUrl: initialData.companyLogoUrl || '',
    description: initialData.description || '',
    location: initialData.location || '',
    employmentType: initialData.employmentType || '',
    yearsOfExperience: initialData.yearsOfExperience || '',
    skills: initialData.skills || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="jobLink" className="block text-sm font-medium text-gray-700">
                      Job Link
                    </label>
                    <input
                      type="url"
                      name="jobLink"
                      id="jobLink"
                      value={formData.jobLink}
                      onChange={handleChange}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="companyLogoUrl" className="block text-sm font-medium text-gray-700">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      name="companyLogoUrl"
                      id="companyLogoUrl"
                      value={formData.companyLogoUrl}
                      onChange={handleChange}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                      Employment Type
                    </label>
                    <input
                      type="text"
                      name="employmentType"
                      id="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      id="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      id="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {buttonText}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ isOpen, onClose, onDelete, jobTitle }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Delete Job
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the job "{jobTitle}"? This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}