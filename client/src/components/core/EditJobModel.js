import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateJobAPI, fetchJobByIdAPI } from '../../api/jobApi';

const EditJobModel = ({ onClose }) => {
  const { id } = useParams();
  const [jobData, setJobData] = useState({
    title: '',
    company_name: '',
    posted_date: '',
    employment_type: '',
    experience_required: '',
    location: '',
    description: '',
    skills_required: [],
    job_link: '',
    company_logo: '',
  });

  useEffect(() => {
    const fetchJobData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const jobDetails = await fetchJobByIdAPI(token, id);
        setJobData(jobDetails);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobData();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await updateJobAPI(token, id, jobData);
      onClose(); // Close the modal after updating
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-2/3 lg:w-1/2 h-[80vh] overflow-auto scrollbar-hidden"> {/* Set height and overflow */}
        <h2 className="text-xl font-bold mb-2 text-center">Edit Job</h2>
        <hr className="border-black mb-4" />
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="flex flex-wrap">
          <div className="mb-4 w-full flex flex-col md:w-1/2 pr-2">
            <label className="block text-gray-700 mb-1" htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pl-2">
            <label className="block text-gray-700 mb-1" htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              value={jobData.company_name}
              onChange={(e) => setJobData({ ...jobData, company_name: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pr-2">
            <label className="block text-gray-700 mb-1" htmlFor="posted_date">Posted Date</label>
            <input
              type="date"
              id="posted_date"
              value={jobData.posted_date.split('T')[0]} // Format to YYYY-MM-DD
              onChange={(e) => setJobData({ ...jobData, posted_date: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pl-2">
            <label className="block text-gray-700 mb-1" htmlFor="employment_type">Employment Type</label>
            <input
              type="text"
              id="employment_type"
              value={jobData.employment_type}
              onChange={(e) => setJobData({ ...jobData, employment_type: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pr-2">
            <label className="block text-gray-700 mb-1" htmlFor="experience_required">Experience Required</label>
            <input
              type="number"
              id="experience_required"
              value={jobData.experience_required}
              onChange={(e) => setJobData({ ...jobData, experience_required: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pl-2">
            <label className="block text-gray-700 mb-1" htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pr-2">
            <label className="block text-gray-700 mb-1" htmlFor="skills_required">Skills Required (comma separated)</label>
            <input
              type="text"
              id="skills_required"
              value={jobData.skills_required.join(', ')} // Convert array to string for editing
              onChange={(e) => setJobData({ ...jobData, skills_required: e.target.value.split(',').map(skill => skill.trim()) })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pl-2">
            <label className="block text-gray-700 mb-1" htmlFor="job_link">Job Link</label>
            <input
              type="url"
              id="job_link"
              value={jobData.job_link}
              onChange={(e) => setJobData({ ...jobData, job_link: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col md:w-1/2 pr-2">
            <label className="block text-gray-700 mb-1" htmlFor="company_logo">Company Logo URL</label>
            <input
              type="url"
              id="company_logo"
              value={jobData.company_logo}
              onChange={(e) => setJobData({ ...jobData, company_logo: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4 w-full flex flex-col">
            <label className="block text-gray-700 mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full h-32 resize-none"
              required
            />
          </div>
          <div className="flex justify-between mt-6 w-full">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-400">Update Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModel;
