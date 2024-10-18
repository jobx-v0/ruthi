const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    type: { type: String, required: true },
    question: { type: String, required: true },
    skills: { type: [String], required: true },
    jobs: { type: [String] },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { collection: "skillQuestions" }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
