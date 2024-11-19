const Interview = require("../models/Interview");
const AzureService = require("../services/azureService");
const OpenAIService = require("../services/openAIService");
const ReportGenerateService = require("../services/reportGenerator");

const processInterview = async (interview) => {
  try {
    const results = [];
    for (const item of interview.data) {
      const { question } = item;
      const res = await AzureService.combineAllChunksInToOneVideo(
        interview.user_id.toString(),
        interview.job_id.toString(),
        interview._id.toString(),
        question.toString()
      );

      const evaluationResult =
        await OpenAIService.evaluateTranscriptionForQuestion(
          interview.job_id,
          question,
          res.transcription
        );

      results.push({
        questionId: question,
        trust_score: res.trust_score,
        ...evaluationResult,
      });
    }

    await OpenAIService.createOrUpdateResults(interview._id, results);

    await OpenAIService.calculateTotalScore(interview._id);

    await OpenAIService.overAllCandidatePerformance(interview._id);

    const { finalOutputPath, blobName, deletePDF } =
      await ReportGenerateService.generateReport(interview._id);

    const sasURL = await AzureService.generateSasTokenForBlob(blobName);

    await AzureService.uploadPdf(sasURL, finalOutputPath);

    await ReportGenerateService.deletePDF(deletePDF);

    interview.evaluation = "completed";
    await interview.save();
  } catch (error) {
    console.error(error);
  }
};

const checkCompletedInterviews = async () => {
  try {
    const interview = await Interview.findOne({
      isCompleted: true,
      evaluation: "not done",
    }).sort({ created_at: 1 });

    if (interview) {
      interview.evaluation = "in process";
      await interview.save();
      await processInterview(interview);
    } else {
      console.log("No pending interviews found to evaluate at this time.");
    }
  } catch (error) {
    console.error("Error processing interviews:", error);
  }
};

setInterval(checkCompletedInterviews, 30 * 60 * 1000);
