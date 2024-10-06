const Interview = require("../models/Interview");
const AzureService = require("../services/azureService");

const processInterview = async (interview) => {
  try {
    for (const item of interview.data) {
      const { question } = item;
      await AzureService.combineAllChunksInToOneVideo(
        (userId = interview.user_id.toString()),
        (jobId = interview.job_id.toString()),
        (questionId = question.toString())
      );
    }

    interview.evaluation = "completed";
    await interview.save();

    console.log(
      `Completed evaluation for userId: ${interview.userId}, jobId: ${interview.jobId} `
    );
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
      processInterview(interview);
    } else {
      console.log("No pending interviews found to evaluate at this time.");
    }
  } catch (error) {
    console.error("Error processing interviews:", error);
  }
};

setInterval(checkCompletedInterviews, 30 * 60 * 1000);
