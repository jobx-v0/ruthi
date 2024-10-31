const OpenAI = require("openai");
const { encoding_for_model } = require("tiktoken");
const Result = require("../models/Result");
const Question = require("../models/Question");
const Job = require("../models/Job");
const system_prompts = require("../config/system_prompts.json");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

class OpenAIServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "OpenAIServiceError";
    this.code = code;
  }
}

const moderateContent = async (text) => {
  try {
    const moderation = await openai.moderations.create({ input: text });
    return moderation.results[0];
  } catch (error) {
    throw new OpenAIServiceError(
      `Content moderation failed: ${error.message}`,
      "MODERATION_ERROR"
    );
  }
};

const getTokenCount = (messages, model) => {
  const enc = encoding_for_model(model);
  return messages.reduce(
    (acc, message) => acc + enc.encode(message.content).length,
    0
  );
};

const calculatePrice = (model, inputTokens, outputTokens) => {
  const priceConfig = {
    "gpt-3.5-turbo-0125": { input: 0.5, output: 1.5 },
    "gpt-3.5-turbo-instruct": { input: 1.5, output: 2.0 },
    "gpt-4o": { input: 5.0, output: 15.0 },
    "gpt-4o-2024-05-13": { input: 5.0, output: 15.0 },
  };

  if (!priceConfig[model]) {
    throw new OpenAIServiceError("Unsupported model", "UNSUPPORTED_MODEL");
  }

  const { input: inputPrice, output: outputPrice } = priceConfig[model];
  const priceInputTokens = (inputTokens / 1000000) * inputPrice;
  const priceOutputTokens = (outputTokens / 1000000) * outputPrice;
  const totalPrice = priceInputTokens + priceOutputTokens;

  return { priceInputTokens, priceOutputTokens, totalPrice };
};

const moderateInterviewText = async (interviewText) => {
  const moderation = await moderateContent(JSON.stringify(interviewText));
  if (moderation.flagged) {
    throw new OpenAIServiceError(
      "Interview text contains inappropriate content.",
      "INAPPROPRIATE_CONTENT"
    );
  }
};

const prepareEvaluationMessages = (interviewText, system_prompt) => {
  return [
    { role: "system", content: system_prompt },
    { role: "user", content: JSON.stringify(interviewText) },
  ];
};

const callOpenAIAPI = async (messages, model, maxTokens) => {
  try {
    return await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" },
    });
  } catch (error) {
    throw new OpenAIServiceError(
      `OpenAI API call failed: ${error.message}`,
      "API_CALL_ERROR"
    );
  }
};

const processAPIResponse = (response, model) => {
  const usage = response.usage;
  const inputTokens = usage.prompt_tokens;
  const outputTokens = usage.completion_tokens;
  const totalTokens = inputTokens + outputTokens;
  const { priceInputTokens, priceOutputTokens, totalPrice } = calculatePrice(
    model,
    inputTokens,
    outputTokens
  );

  return {
    result: JSON.parse(response.choices[0].message.content),
    inputTokens,
    outputTokens,
    totalTokens,
    priceInputTokens,
    priceOutputTokens,
    totalPrice,
  };
};

const evaluateAnswer = async (interviewText, system_prompt) => {
  if (!interviewText) {
    throw new OpenAIServiceError(
      "Interview text is required for evaluation.",
      "MISSING_INTERVIEW_TEXT"
    );
  }
  try {
    await moderateInterviewText(interviewText);
  } catch (error) {
    console.log("Error moderating interview text:", error.message);
    console.log("Interview contains inappropriate content");
    console.log(
      "Scoring 0 for all categories and providing feedback to the candidate"
    );
    return {
      scores: {
        communication_skills: 0,
        subject_expertise: 0,
        relevancy: 0,
      },
      feedback:
        "Your answer contains inappropriate content. Please provide a professional response.",
    };
  }
  const model = "gpt-3.5-turbo-0125";
  const maxTokens = 150;
  const messages = prepareEvaluationMessages(interviewText, system_prompt);

  const response = await callOpenAIAPI(messages, model, maxTokens);
  const processedResponse = processAPIResponse(response, model);

  return processedResponse.result;
};

const createOrUpdateResults = async (interviewId, results) => {
  let result = await Result.findOne({ interview_id: interviewId });

  if (!result) {
    result = new Result({ interview_id: interviewId, question_scores: [] });
  }

  const existingQuestionsMap = new Map(
    result.question_scores.map((qs) => [qs.question_id.toString(), qs])
  );

  for (const { questionId, scores, feedback, review, trust_score } of results) {
    if (existingQuestionsMap.has(questionId.toString())) {
      const existingScore = existingQuestionsMap.get(questionId.toString());
      existingScore.scores = scores;
      existingScore.feedback = feedback;
      existingScore.review = review;
      existingScore.trust_score = trust_score;
    } else {
      const newQuestionData = {
        question_id: questionId,
        scores: scores,
        feedback: feedback,
        review: review,
        trust_score: trust_score,
      };
      result.question_scores.push(newQuestionData);
    }
  }

  await result.save();
};

const evaluateTranscriptionForQuestion = async (
  job_id,
  questionId,
  transcription
) => {
  if (!questionId) {
    console.log("Skipping empty question");
    return;
  }

  if (!transcription || transcription === "") {
    let defaultScores = {
      communication_skills: 0,
      subject_expertise: 0,
      relevancy: 0,
    };

    return {
      scores: defaultScores,
      feedback: "",
      review: "",
    };
  }

  var question;
  var system_prompt;

  const job = await Job.findById(job_id);

  if (!job || !job.questions || job.questions.length < 5) {
    console.log("No questions found for this job.");
    const questionDoc = await Question.findById(questionId);
    question = questionDoc.question;
    system_prompt = system_prompts.Strict_HR_Interview_Evaluation_Prompt;
  } else {
    const questionDoc = job.questions.find(
      (q) => q._id.toString() === questionId.toString()
    );
    question = `Question: ${questionDoc.question} || Expected answer: ${questionDoc.answer}`;
    system_prompt = system_prompts.HR_Interview_Expected_Evaluation_Prompt;
  }

  const response = await evaluateAnswer(
    { question, answer: transcription },
    system_prompt
  );

  const scores = response.scores;
  const feedback = response.feedback;
  const review = response.review;

  return {
    scores,
    feedback,
    review,
  };
};

const calculateTotalScore = async (interviewId) => {
  try {
    const result = await Result.findOne({ interview_id: interviewId });

    if (!result) {
      throw new Error("Result not found for the given interview_id");
    }

    const interviewTextLength = result.question_scores.length;
    let totalScore = 0;
    let totalScoreInEachCategory = new Map();

    result.question_scores.forEach(({ scores }) => {
      for (const [category, score] of scores) {
        if (!totalScoreInEachCategory.has(category)) {
          totalScoreInEachCategory.set(category, 0);
        }

        totalScoreInEachCategory.set(
          category,
          totalScoreInEachCategory.get(category) + score
        );

        totalScore += score;
      }
    });

    for (const [category, score] of totalScoreInEachCategory) {
      totalScoreInEachCategory.set(category, score / interviewTextLength);
    }

    totalScore =
      Math.round(
        (totalScore / interviewTextLength / totalScoreInEachCategory.size) * 100
      ) / 100;

    totalScore = (totalScore / 5) * 100;

    const totalScoreInEachCategoryObject = Object.fromEntries(
      totalScoreInEachCategory
    );

    await Result.updateOne(
      { interview_id: interviewId },
      {
        total_score: totalScore,
        total_score_in_each_category: totalScoreInEachCategoryObject,
      }
    );

    return;
  } catch (error) {
    console.error("Error calculating total scores:", error);
  }
};

const overAllCandidatePerformance = async (interviewId) => {
  try {
    const result = await Result.findOne({ interview_id: interviewId });

    if (
      !result ||
      !result.question_scores ||
      result.question_scores.length === 0
    ) {
      console.log("No results found for the interview.");
      return;
    }

    const reviews = result.question_scores.map((score) => score.review);

    const combinedReviews = reviews.join(" ");

    const system_prompt = system_prompts.Final_Review_Aggregation_Prompt;

    const response = await evaluateAnswer(
      { allReviews: combinedReviews },
      system_prompt
    );

    let totalTrustScore = 0;
    let lengthOfQuestionsArray = result.question_scores.length;

    result.question_scores.forEach((score) => {
      totalTrustScore += score.trust_score || 0;
    });

    const finalTrustScore = totalTrustScore / lengthOfQuestionsArray;

    result.final_trust_score = finalTrustScore;
    result.final_review = response.final_review;

    await result.save();
  } catch (error) {
    console.error("Error in overAllCandidatePerformance:", error);
  }
};

const OpenAIService = {
  moderateContent,
  getTokenCount,
  calculatePrice,
  evaluateAnswer,
  evaluateTranscriptionForQuestion,
  createOrUpdateResults,
  calculateTotalScore,
  overAllCandidatePerformance,
};

module.exports = OpenAIService;
