const Interview = require("../models/Interview");
const Job = require("../models/Job");
const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");

const getResult = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Fetch user information from User model
    const user = await User.findById(userId).select("email username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch job information from Job model
    const job = await Job.findById(jobId).select("title skills_required");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const interviewDoc = await Interview.findOne({
      job_id: jobId,
      user_id: userId,
    });
    if (!interviewDoc) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const resultDoc = await Result.findOne({ interview_id: interviewDoc._id });
    if (!resultDoc) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Determine whether the job has a questions field
    const jobHasQuestions = job.questions && job.questions.length > 4;

    // Iterate over interview data and replace question ObjectId with actual question text
    const updatedData = await Promise.all(
      interviewDoc.data.map(async (item) => {
        let questionText;

        if (jobHasQuestions) {
          // If job has questions, find the question in job.questions
          const jobQuestion = job.questions.find(
            (q) => q._id.toString() === item.question.toString()
          );

          // If found in job.questions, use it, otherwise fallback to Question model
          if (jobQuestion) {
            questionText = jobQuestion.question;
          } else {
            const questionDoc = await Question.findById(item.question);
            questionText = questionDoc
              ? questionDoc.question
              : "Question not found";
          }
        } else {
          // If no questions in Job, fetch from Question model
          const questionDoc = await Question.findById(item.question);
          questionText = questionDoc
            ? questionDoc.question
            : "Question not found";
        }

        // Initialize the updated item with question details
        const updatedItem = {
          _id: item.question, // Keep original ObjectId in _id field
          question: questionText, // Set the question text
          answer: item.answer,
        };

        // Find the matching question scores, feedback, and review from resultDoc
        const matchingResult = resultDoc.question_scores.find(
          (q) => q.question_id.toString() === item.question.toString()
        );

        // If found, add scores, feedback, and review
        if (matchingResult) {
          updatedItem.scores = matchingResult.scores;
          updatedItem.feedback = matchingResult.feedback;
          updatedItem.review = matchingResult.review;
        }

        return updatedItem;
      })
    );

    // Send the result
    res.status(200).json({
      interview_id: interviewDoc._id,
      userEmail: user.email,
      username: user.username,
      jobTitle: job.title,
      jobSkills: job.skills_required,
      interviewData: updatedData,
      total_score_in_each_category: resultDoc.total_score_in_each_category,
      total_score: resultDoc.total_score,
      final_trust_score: resultDoc.final_trust_score,
      final_review: resultDoc.final_review,
    });
  } catch {
    res.status(500).json({ message: "Error fetching result" });
  }
};

const ResultController = { getResult };

module.exports = ResultController;
