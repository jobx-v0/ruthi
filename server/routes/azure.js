const express = require("express");
const router = express.Router();

const AzureController = require("../controllers/azureController");

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

module.exports = router;
