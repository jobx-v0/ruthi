const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const InterviewController = require("../controllers/interviewController.js");
const AzureService = require("../services/azureService.js");

router.get("/questions", authMiddleware, InterviewController.getQuestions);

router.post(
  "/get-questions-by-skills",
  authMiddleware,
  InterviewController.getQuestionsBySkills
);

router.get(
  "/count",
  authMiddleware,
  InterviewController.getCurrentCountOfInterviews
);

router.post("/responses", authMiddleware, InterviewController.submitInterview);

router.post("/create-interview", InterviewController.createInterview);

router.post(
  "/verify-interview-token",
  InterviewController.verifyInterviewToken
);

router.post("/save-chunk-number", InterviewController.saveChunkNumber);

router.post("/submit-interview", InterviewController.submitInterview);

router.post("/update-answer", InterviewController.updateAnswer);

router.get(
  "/download-pdf/:interviewId",
  AzureService.downloadBlobPDFToFrontend
);

router.get(
  "/download-webm-video/:interviewId/:questionId",
  AzureService.downloadVideoToFrontend
);

module.exports = router;
