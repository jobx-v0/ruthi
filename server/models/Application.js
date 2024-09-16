const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new Schema({
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
  status: {
    type: String,
    enum: ["applied", "interviewed", "hired", "rejected"],
    default: "applied",
  },
  scores: {
    communication: { type: Number, default: 0 },
    subject_expertise: { type: Number, default: 0 },
    relevancy: { type: Number, default: 0 },
  },
  applied_at: {
    type: Date,
    default: Date.now,
  },
  // Add any other fields you might need
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
