import React from 'react'
import ApplicantList from './ApplicantList'

export default function JobDetails({ job, onEdit, onDelete }) {
  if (!job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="w-full lg:w-2/3 mt-4 lg:mt-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.department} • {job.location}</p>
          </div>
          <div>
            <button
              onClick={onEdit}
              className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Applicants</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.applicants}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Posted Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.posted}</dd>
            </div>
          </dl>
        </div>
        <ApplicantList jobId={job.id} />
      </div>
    </div>
  )
}
