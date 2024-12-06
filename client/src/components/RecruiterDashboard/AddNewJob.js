import { useState, useEffect } from "react";
import { useCustomToast } from "../utils/useCustomToast";
import { addJobAPI } from "../../api/jobApi";
import { Plus, Trash2 } from "lucide-react";
import { jobFormSchema } from "../../validators/ZodSchema";

const JobForm = () => {
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
    custom_interview: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showToast = useCustomToast();
  const [authToken, setAuthToken] = useState(null);
  const [questionEntries, setQuestionEntries] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    setQuestionEntries(formData.custom_interview);
  }, []);

  const getPostDate = () => {
    return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };
  const validateField = (name, value) => {
    try {
      jobFormSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "skills_required"
          ? value.split(",").map((skill) => skill.trim())
          : name === "experience_required"
          ? Number(value)
          : value,
    }));
    validateField(name, value);
  };
  const getDescriptionPoints = () => {
    return formData.description
      .split("\n")
      .filter((point) => point.trim() !== "");
  };
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(formData, "form data");
      await addJobAPI(authToken, formData);
      setSubmitted(true);
      showToast("Job added successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add quations. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle deleting a question entry
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questionEntries.filter((_, i) => i !== index);
    setQuestionEntries(updatedQuestions);
    setFormData((prevData) => ({
      ...prevData,
      custom_interview: updatedQuestions,
    }));
  };
  const handleAddQuestiona = () => {
    setShowQuestions(true);
    setQuestionEntries((prevEntries) => [
      ...prevEntries,
      { question: "", answer: "" },
    ]);
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
      custom_interview: [],
    });
    setErrors({});
    setQuestionEntries([]);
    setSubmitted(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-5 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[70%] p-5 border border-gray-300 rounded-lg bg-white shadow-xl relative">
          <h2 className="text-center text-2xl text-gray-900">Add New Job</h2>
          <hr className="my-4 border-gray-500" />
          {!submitted ? (
            <form onSubmit={handleJobSubmit} className="flex flex-col">
              <div className="flex items-center justify-end space-x-2 m-4">
                <label
                  htmlFor="postedDate"
                  className="text-sm font-medium text-gray-900"
                >
                  Posting Date:
                </label>
                <p
                  id="postedDate"
                  name="posted_date"
                  className="text-sm text-gray-900"
                >
                  {getPostDate()} {/* Automatically set the post date */}
                </p>
              </div>
              <div className="one flex space-x-4 mb-4">
                <div className="flex  w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Title:<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col w-full ">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      placeholder="Job Name"
                      style={{ fontSize: "0.875rem" }}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                        errors.title ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.title && (
                      <span className="text-red-500 text-xs">
                        {errors.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Job Link:
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="url"
                      name="job_link"
                      value={formData.job_link}
                      onChange={handleChange}
                      placeholder="https://.."
                      style={{ fontSize: "0.875rem" }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                        errors.job_link ? "border-red-500" : ""
                      }`}
                    />
                    {errors.job_link && (
                      <span className="text-red-500 text-xs">
                        {errors.job_link}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="one flex space-x-4 mb-4">
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Experience Required (years)
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col w-full ">
                    <input
                      type="number"
                      name="experience_required"
                      value={formData.experience_required}
                      onChange={handleChange}
                      placeholder="0"
                      style={{ fontSize: "0.875rem" }}
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
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Company Name<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col w-full ">
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Your Organization Name"
                      style={{ fontSize: "0.875rem" }}
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
              </div>

              <div className="one flex space-x-4 mb-4">
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Company Logo URL:
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="url"
                      name="company_logo"
                      value={formData.company_logo}
                      placeholder="https://.."
                      style={{ fontSize: "0.875rem" }}
                      onChange={handleChange}
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
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Location:<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      placeholder=""
                      style={{ fontSize: "0.875rem" }}
                      onChange={handleChange}
                      className={`px-3 py-2 border rounded-md shadow-sm ${
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
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Skills Required:<span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      name="skills_required"
                      value={formData.skills_required.join(", ")}
                      onChange={handleChange}
                      placeholder="Comma-separated values"
                      style={{ fontSize: "0.875rem" }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                        errors.skills_required ? "border-red-500" : ""
                      }`}
                    />
                    {errors.skills_required && (
                      <span className="text-red-500 text-xs">
                        {errors.skills_required}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center w-1/2">
                  <label className="w-48 text-sm text-gray-900">
                    Employment Type:<span className="text-red-500">*</span>
                  </label>
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
                <label className="w-48 text-sm text-gray-900 mb-2">
                  Job Description:
                </label>
                <div className="flex flex-col w-full">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your Job"
                    style={{ fontSize: "0.875rem" }}
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
              <div className="mt-4">
                <ul className="list-disc list-inside">
                  {getDescriptionPoints().map((point, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="my-4 border-t-1 border-gray-900" />
              {/* Questions Section */}
              <div className="flex items-center justify-between mr-5">
                <h3 className="text-lg text-gray-800 mt-4">Questions</h3>
                <button
                  type="button"
                  onClick={() => {
                    handleAddQuestiona();
                  }}
                  className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
                  aria-label="Add question"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div
                className={`transition-all duration-2000 ${
                  showQuestions
                    ? "opacity-100"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                {showQuestions &&
                  questionEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="relative bg-white border rounded-lg shadow-md p-4 mb-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 />
                      </button>

                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700">
                            Question:<span className="text-red-500">*</span>
                          </h3>
                          <input
                            type="text"
                            value={entry.question}
                            onChange={(e) => {
                              const updatedEntries = [...questionEntries];
                              updatedEntries[index].question = e.target.value;
                              setQuestionEntries(updatedEntries);
                              setFormData((prevData) => ({
                                ...prevData,
                                custom_interview: updatedEntries,
                              }));
                            }}
                            placeholder="Enter question"
                            className="w-full px-3 py-2 border rounded-md shadow-sm mt-1"
                            required
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-700">
                            Answer
                          </h3>
                          <input
                            type="text"
                            value={entry.answer}
                            onChange={(e) => {
                              const updatedEntries = [...questionEntries];
                              updatedEntries[index].answer = e.target.value;
                              setQuestionEntries(updatedEntries);
                              setFormData((prevData) => ({
                                ...prevData,
                                custom_interview: updatedEntries,
                              }));
                            }}
                            placeholder="Enter answer (Optional)"
                            className="w-full px-3 py-2 border rounded-md shadow-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/*end */}
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
              <h3 className="text-lg text-green-600">
                Job added successfully!
              </h3>
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
