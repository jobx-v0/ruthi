const mongoose = require("mongoose");
const { Schema } = mongoose;

Schema.Types.String.checkRequired((v) => v != null);

const interviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  data: [
    {
      question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: { type: String, required: true },
      number_of_chunks: {
        type: Number,
        expires: "24h",
      },
      _id: false,
    },
  ],
  created_at: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  evaluation: {
    type: String,
    enum: ["not done", "in process", "completed"], // Enum to represent different states
    default: "not done", // Default value
  },
});

// Model
const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
