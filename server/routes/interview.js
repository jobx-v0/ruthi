const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const InterviewController = require("../controllers/interviewController.js");
const InterviewService = require("../services/interviewService.js");
const AzureService = require("../services/azureService.js");

// Use the authMiddleware to protect the /questions route
router.get("/questions", authMiddleware, InterviewController.getQuestions);

router.post(
  "/get-questions-by-skills",
  authMiddleware,
  InterviewController.getQuestionsBySkills
);

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

router.post("/create-interview", InterviewController.createInterview); // verified. It takes input in this format:
// {
//     "user_id":"66f590458326f7c16ba3e97a",
//     "job_id":"66f65a32020744c01dd2d902",
//     "question_ids":["654e76feddc03d85cd1ae411",
//                     "654e76feddc03d85cd1ae4a2",
//                     "654e76feddc03d85cd1ae4d4",
//                     "654e76feddc03d85cd1ae4d2",
//                     "654e76feddc03d85cd1ae4ad",
//                     "654e76feddc03d85cd1ae3f9"]
// }

router.post("/save-chunk-number", InterviewController.saveChunkNumber);

router.post("/submit-interview", InterviewController.submitInterview);

router.post("/update-answer", InterviewController.updateAnswer);

router.get(
  "/download-pdf/:interviewId",
  AzureService.downloadBlobPDFToFrontend
);

module.exports = router;
