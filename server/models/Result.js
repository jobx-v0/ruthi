const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new Schema({
  interview_id: {
    type: Schema.Types.ObjectId,
    ref: "Interview",
    required: true,
  },
  question_scores: [
    {
      question_id: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      scores: {
        type: Map,
        of: Number,
        default: {},
      },
      feedback: { type: String, required: true },
      review: { type: String, required: true },
      _id: false,
    },
  ],
  total_score_in_each_category: {
    type: Map,
    of: Number,
    default: {},
  },
  total_score: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  final_review: { type: String },
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
