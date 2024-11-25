const Interview = require("../models/Interview");
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5;
const Question = require("../models/Question");
const Job = require("../models/Job");
const InterviewService = require("../services/interviewService");
const AzureService = require("../services/azureService");
const OpenAIService = require("../services/openAIService");
const jwt = require("jsonwebtoken");

const { JWT_TOKEN_SECRET_KEY } = process.env;

const getQuestions = async (req, res) => {
  try {
    const numberOfQuestions =
      parseInt(process.env.NUMBER_OF_QUESTIONS_IN_INTERVIEW) || 3;
    const randomQuestions = await Question.aggregate([
      { $sample: { size: numberOfQuestions } },
    ]);

    res.json({ Questions: randomQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

const getQuestionsBySkills = async (req, res) => {
  try {
    const numberOfQuestions =
      parseInt(process.env.NUMBER_OF_QUESTIONS_IN_INTERVIEW) || 5;

    const jobId = req.body.jobId;

    const job = await Job.findById(jobId);

    if (job.questions && job.questions.length > 0) {
      const shuffledQuestions = job.questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions
        .slice(0, numberOfQuestions)
        .map((question) => ({
          _id: question._id,
          type: question.type,
          question: question.question,
        }));

      return res.status(200).json(selectedQuestions);
    }

    const skills = job.skills_required;

    const questions = await Question.aggregate([
      { $match: { skills: { $in: skills } } },
      { $sample: { size: Number(numberOfQuestions) } },
      {
        $project: {
          _id: 1,
          question: 1,
          category: 1,
          type: 1,
        },
      },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

const saveChunkNumber = async (req, res) => {
  const { userID, jobID, questionID, numberOfChunks } = req.body;
  try {
    let interview = await Interview.findOne({ user_id: userID, job_id: jobID });

    if (!interview) {
      return res.status(400).json({ message: "No Interview Exists!" });
    }

    const questionIndex = interview.data.findIndex(
      (item) => item.question.toString() === questionID.toString()
    );

    if (questionIndex > -1) {
      interview.data[questionIndex].number_of_chunks = numberOfChunks;

      await interview.save();
      return res
        .status(200)
        .json({ message: "Number of chunks saved successfully!" });
    } else {
      return res
        .status(400)
        .json({ message: "Question doesn't exist in the interview!" });
    }
  } catch (error) {
    console.error("Error saving number of chunks");
    return res.status(500).json({ error: "Error saving number of chunks" });
  }
};

const submitInterview = async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    const interview = await Interview.findOne({
      user_id: userId,
      job_id: jobId,
    });
    if (!interview) {
      return res.status(400).json({ message: "No interview found!" });
    }

    interview.isCompleted = true;

    await interview.save();

    res.status(200).json({ message: "Interview submitted successfully" });
  } catch (error) {
    console.error("Error in interview submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const triggerAsyncProcessing = async (userId, jobId) => {
  try {
    console.log(
      `Starting async processing for user ${userId} and job ${jobId}`
    );

    console.log("Sleeping for 30 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    console.log("Processing videos...");
    await AzureService.processVideoForAllQuestions(userId, jobId);

    console.log("Evaluating transcriptions...");
    await OpenAIService.evaluateTranscriptionForAllQuestions(userId, jobId);

    console.log("Async processing completed successfully");
  } catch (error) {
    console.error("Error in async processing:", error);
    throw new Error(`Async processing failed: ${error.message}`);
  }
};

const updateAnswer = async (req, res) => {
  const { user_id, job_id, question_id, transcription } = req.body;
  try {
    await InterviewService.updateAnswer(
      user_id,
      job_id,
      question_id,
      transcription
    );
    res.status(200).json({ message: "Answer updated successfully." });
  } catch (error) {
    console.error("Error updating answer:", error);
    switch (error.message) {
      case "Interview not found":
      case "Question not found":
        res.status(404).json({ message: error.message });
        break;
      case "Answer already exists":
        res
          .status(409)
          .json({ message: "Answer already exists and cannot be updated." });
        break;
      default:
        res
          .status(500)
          .json({ message: "Failed to update answer. Please try again." });
    }
  }
};

const createInterview = async (req, res) => {
  const { user_id, job_id, question_ids } = req.body;

  try {
    await InterviewService.checkExistingInterview(user_id, job_id);

    const data = InterviewService.createInterviewData(question_ids);
    const interview = await InterviewService.saveInterview(
      user_id,
      job_id,
      data
    );

    res.status(201).json({
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    if (error.message === "Interview already exists for this user and job") {
      res
        .status(400)
        .json({ message: "Interview already exists for this user and job" });
    } else {
      res
        .status(500)
        .json({ message: "Error creating interview", error: error.message });
    }
  }
};

const getCurrentCountOfInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    let interviewCount = await Interview.countDocuments({ user_id: userId });

    if (interviewCount) {
      return res.status(200).json({ count: interviewCount });
    }
    return res.status(200).json({ count: 0 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to get the count data. Please try again" });
  }
};

const getInterviewDetails = async (user_id, job_id) => {
  try {
    const interview = await Interview.findOne({ user_id, job_id });

    if (!interview) {
      return null;
    }

    return {
      interviewQuestions: interview.interviewQuestions,
    };
  } catch (error) {
    console.error("Error retrieving interview details:", error);
    throw error;
  }
};

const verifyInterviewToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_TOKEN_SECRET_KEY);

    const { startTime, endTime, user_id, job_id } = decodedToken;

    const currentTime = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const currentDateStr = currentTime.toISOString().slice(0, 19);
    const startDateStr = startDate.toISOString().slice(0, 19);
    const endDateStr = endDate.toISOString().slice(0, 19);

    if (currentDateStr < startDateStr) {
      return res.status(400).json({
        status: "early",
        message: "You are trying to access the interview too early.",
      });
    } else if (currentDateStr > endDateStr) {
      return res.status(400).json({
        status: "expired",
        message: "The interview time has expired.",
      });
    }

    const interviewDetails = await getInterviewDetails(user_id, job_id);

    if (!interviewDetails) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (
      interviewDetails.interviewQuestions &&
      interviewDetails.interviewQuestions.length > 0
    ) {
      return res.status(403).json({
        status: "completed",
        message: "Interview has already been completed",
      });
    }

    return res.status(200).json({
      status: "valid",
      message: "Token is valid for the interview.",
      job_id: job_id,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(401)
      .json({ status: "invalid", message: "Invalid token" });
  }
};

const InterviewController = {
  getQuestions,
  getQuestionsBySkills,
  saveChunkNumber,
  submitInterview,
  getCurrentCountOfInterviews,
  createInterview,
  updateAnswer,
  verifyInterviewToken,
};

module.exports = InterviewController;
