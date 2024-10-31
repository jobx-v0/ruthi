const Job = require("../models/Job");
const mongoose = require("mongoose"); // Add this line
const { ObjectId } = mongoose.Types;

// Controller function to create a new job posting
const createJob = async (req, res) => {
  try {
    // Extract data from the request body
    const { job_link, posted_date } = req.body;

    // Check if a job with the same job link and posted date already exists
    const existingJob = await Job.findOne({ job_link, posted_date });

    if (existingJob) {
      // If a job with the same link and posted date exists, return an error
      return res.status(400).json({ message: "Job already exists." });
    }

    // If the job does not already exist, create a new job posting
    const newJob = new Job(req.body);
    await newJob.save();
    console.log("New Job Added Successfully");

    res.status(201).json({ message: "Job posting created successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create job posting. Please try again." });
  }
};

// Controller function to get all job postings with pagination
const getAllJobs = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let query = {};

    // If search query is provided, construct a regex pattern for case-insensitive search
    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { company_name: { $regex: regex } },
        ],
      };
    }

    // Set default values for page and limit
    const pageNumber = parseInt(page) || 1;
    let pageSize = parseInt(limit) || 10;

    // Calculate the skip value based on the page number and limit
    const skip = (pageNumber - 1) * pageSize;

    // Fetch jobs from the database based on the search query and pagination
    const jobs = search
      ? await Job.find(query).skip(skip).limit(pageSize)
      : await Job.find().skip(skip).limit(pageSize);

    // Calculate the total number of jobs matching the search query
    const totalJobs = search
      ? await Job.countDocuments(query)
      : await Job.countDocuments();

    // Calculate the total number of pages based on the total number of jobs and page size
    const totalPages = Math.ceil(totalJobs / pageSize);

    res.status(200).json({ jobs, pageNumber, pageSize, totalPages });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// Controller function to get a single job posting by ID
const mongoose = require('mongoose');

const getJobById = async (req, res) => {
  const { id } = req.params;

  // Validate the Object ID format
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid job ID." });
  }

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve job posting. Please try again." });
  }
};


// Controller function to update a job posting by ID
const updateJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    res.json({ message: "Job posting updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update job posting. Please try again." });
  }
};

// Controller function to delete a job posting by ID
const deleteJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    console.log("Deleted Job successfully");
    res.json({ message: "Job posting deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete job posting. Please try again." });
  }
};

const addCustomQuestions = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { questions } = req.body;

    // Check if the questions are an array
    if (!Array.isArray(questions)) {
      return res
        .status(400)
        .json({ error: "Questions should be an array of objects." });
    }

    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Assign an _id to each question and push to the job's questions array
    questions.forEach((question) => {
      job.questions.push({
        _id: new ObjectId(), // Assigning a new ObjectId for each question
        type: question.type,
        question: question.question,
        answer: question.answer, // if you store answers as well
      });
    });

    // Save the job
    await job.save();

    res.status(200).json({ message: "Questions added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
};

// delete a specific question by _id
const deleteCustomQuestionById = async (req, res) => {
  try {
    const { jobId, questionId } = req.params;

    // Convert questionId to ObjectId using 'new'
    const objectIdQuestionId = new mongoose.Types.ObjectId(questionId);

    // Find the job by ID and update it
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $pull: { questions: { _id: objectIdQuestionId } } }, // Remove the question by ObjectId
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting question" });
  }
};

// update a specific question by _id
const updateCustomQuestionById = async (req, res) => {
  try {
    const { jobId, questionId } = req.params;
    const { type, question, answer } = req.body; // Data to update the question

    const objectIdQuestionId = new mongoose.Types.ObjectId(questionId);

    // Find the job and update the question with the given _id
    const job = await Job.findOneAndUpdate(
      { _id: jobId, "questions._id": objectIdQuestionId },
      {
        $set: {
          "questions.$.type": type,
          "questions.$.question": question,
          "questions.$.answer": answer,
        },
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job or Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating question" });
  }
};

// delete all questions (remove the 'questions' field)
const deleteAllCustomQuestions = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID and update it by removing the 'questions' field entirely
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $unset: { questions: 1 } }, // Remove the entire questions field
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "All questions deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting all questions" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
  addCustomQuestions,
  deleteCustomQuestionById,
  updateCustomQuestionById,
  deleteAllCustomQuestions,
};
