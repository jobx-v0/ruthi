const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const AzureController = require("../controllers/azureController");
const AzureService = require("../services/azureService");

router.get(
  "/sas/:userId/:jobId/:interviewId/:questionId/:chunkNo",
  AzureController.generateSasToken
);

router.get("/sas/:userId", AzureController.generateSasTokenForUser);

router.post(
  "/transcribeForOneQuestion",
  AzureController.handleTranscriptionForOneQuestion
);

router.post("/transcribe", AzureController.handleTranscriptionForAllQuestions);

router.get("/audio/download", AzureController.downloadAudio);

router.post("/combine-video", AzureController.combineVideo);

router.get(
  "/get-resume",
  authMiddleware,
  AzureService.downloadBlobUserResumeToFrontend
);

module.exports = router;
