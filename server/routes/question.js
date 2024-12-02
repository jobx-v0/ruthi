const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/questionController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Create a new question, isAdmin, we needa add this later.
router.post(
  "/questions",
  authMiddleware,
  QuestionController.createQuestion
);

// Get all questions
router.get("/questions", authMiddleware, QuestionController.getAllQuestions);

// Get a single question by ID
router.get(
  "/questions/:id",
  authMiddleware,
  QuestionController.getQuestionById
);

// Update a question by ID
router.put(
  "/questions/:id",
  authMiddleware,
  QuestionController.updateQuestionById
);

// Delete a question by ID
router.delete(
  "/questions/:id",
  authMiddleware,
  QuestionController.deleteQuestionById
);

module.exports = router;
