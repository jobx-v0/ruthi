const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Create a new job posting
router.post("/postjob",   JobController.createJob);//isAdmin,authMiddleware,

// Get all job postings
router.get("/jobs",  authMiddleware, JobController.getAllJobs);

// Get a single job posting by ID
router.get("/jobs/:id",authMiddleware,  JobController.getJobById);

// Update a job posting by ID
router.put("/jobs/:id", authMiddleware, JobController.updateJobById);//, isAdmin,

// Delete a job posting by ID
router.delete(
  "/jobs/:id",
  authMiddleware,
  JobController.deleteJobById
);//,isAdmin,

// add questions to a job
router.post("/jobs/:id/questions", JobController.addCustomQuestions);

// Route to delete a specific question by _id
router.delete(
  "/job/:jobId/question/:questionId",
  JobController.deleteCustomQuestionById
);

// Route to update a specific question by _id
router.put(
  "/job/:jobId/question/:questionId",
  JobController.updateCustomQuestionById
);

// Route to delete all questions (remove the 'questions' field)
router.delete("/job/:jobId/questions", JobController.deleteAllCustomQuestions);

module.exports = router;
