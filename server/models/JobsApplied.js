const mongoose = require("mongoose");
const { Schema } = mongoose;

const appliedCandidatesSchema = new Schema({
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  appliedDate: {
    type: Date,
  },

  currentStage: {
    type: String,
    enum: [
      "Applied",
      "Profile Screening",
      "Shortlisted",
      "Interview 1",
      "Interview 2",
      "Final Interview",
    ],
    default: "Applied",
  },
  stage: {
    applied: { type: Boolean, default: true }, // Initial stage, always true
    profileScreening: { type: Boolean, default: false },
    shortlisted: { type: Boolean, default: false },
    interview1: { type: Boolean, default: false },
    interview2: { type: Boolean, default: false },
    finalInterview: { type: Boolean, default: false },
  },
  notes: [
    {
      note: {
        ref: "UserProfile",
        type: String,
      },
    },
  ],
});

const Application = mongoose.model("Application", appliedCandidatesSchema);
module.exports = Application;
