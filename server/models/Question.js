// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const questionSchema = new Schema({
//   category: String,
//   sub_category: String,
//   type: String,
//   question: { type: String, required: true },
//   skills: [String], // Array of skills associated with the question
//   jobs: [String], // Array of job IDs associated with the question
// });

// const Question = mongoose.model("Question", questionSchema);

// module.exports = Question;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    type: { type: String, required: true },
    question: { type: String, required: true },
    skills: { type: [String], required: true }, // Array of skills associated with the question
    jobs: { type: [String] }, // Array of job IDs associated with the question
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    }, // Level of the question
  },
  { collection: "skillQuestions" }
); // Specify collection name

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
