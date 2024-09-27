const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const InterviewController = require("../controllers/interviewController.js");

// Use the authMiddleware to protect the /questions route
router.post(
  "/questions",
  authMiddleware,
  InterviewController.getQuestionsBySkills
); // verified and completed

// Get route to get the current count of interviews for a given user
// The authMiddleware ensures that only authenticated users can post an interview
router.get(
  "/count",
  authMiddleware,
  InterviewController.getCurrentCountOfInterviews
);

// POST route for submitting an interview
// The authMiddleware ensures that only authenticated users can post an interview
router.post("/responses", authMiddleware, InterviewController.submitInterview);

// if (process.env.ENABLE_AI_EVALUATION === 'true'){
//     // POST route for evaluating an interview
//     router.get('/evaluate', authMiddleware, InterviewController.evaluateInterview);
// }

router.post("/create-interview", InterviewController.createInterview);
router.post("/submit-interview", InterviewController.submitInterview);

router.post("/update-answer", InterviewController.updateAnswer);

module.exports = router;
