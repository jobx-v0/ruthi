import { formatDistanceToNow } from "date-fns";
import ChatBotUI from "../chatbot/ChatBotUI";
import { useEffect, useState } from "react";

const JobPostMain = ({
  _id,
  title,
  jobLink,
  companyLogoUrl,
  company,
  description,
  location,
  employmentType,
  yearsOfExperience,
  skills,
  posted_date,
  numberOfApplicants,
  handleDelete,
  handleEdit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleApplyNow = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showModal]);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto my-4 p-6 bg-white shadow-md rounded-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={companyLogoUrl}
              alt={`${company} logo`}
              className="w-16 h-16 object-contain rounded-[6px] overflow-h_den"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-600">{company}</p>
              <p className="text-gray-500">{location}</p>
            </div>
          </div>

          {handleEdit && handleDelete && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(_id)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(_id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-700">{description}</p>
        </div>

        <div className="mt-4 flex space-x-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
            {employmentType}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">
            {yearsOfExperience} years experience
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Skills Required:</h3>
          <ul className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full m-1"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-2 items-start text-sm text-gray-400">
          <span>{numberOfApplicants} applicants</span>
          <span>Posted {formatDistanceToNow(new Date(posted_date))} ago</span>
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button
            className="bg-orange-500 text-white py-2 px-4 rounded-[20px] text-sm"
            onClick={handleApplyNow}
          >
            Apply Now
          </button>
          <button className="bg-gray-200 text-black py-2 px-4 rounded-[20px] ">
            <a
              href={jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-sm"
            >
              View Job Details
            </a>
          </button>
        </div>
      </div>
      {showModal && (
        <ChatBotUI
          handleApplyNow={handleApplyNow}
          job_id={_id}
          company={company}
        />
      )}
    </>
  );
};

export default JobPostMain;
