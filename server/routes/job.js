const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Create a new job posting
router.post("/jobs", authMiddleware, isAdmin, JobController.createJob); // Corrected and verified

// Get all job postings
router.get("/jobs", authMiddleware, JobController.getAllJobsPagination); // Created getAllJobsPagination function which will fetch all jobs using the page number and as well as by the search term.

// Get a single job posting by ID
router.get("/jobs/:id", authMiddleware, JobController.getJobById); // Checked but need to change

// Update a job posting by ID
router.put("/jobs/:id", authMiddleware, isAdmin, JobController.updateJobById);

// Delete a job posting by ID
router.delete(
  "/jobs/:id",
  authMiddleware,
  isAdmin,
  JobController.deleteJobById
);

module.exports = router;
