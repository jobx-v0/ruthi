const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the user profile
const userProfileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personal_information: {
      first_name: { type: String },
      last_name: { type: String },
      email: { type: String, unique: true },
      phone: { type: String },
      expected_salary: { type: Number },
    },
    socials: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    courses: [
      {
        course_name: { type: String },
        course_link: { type: String },
        course_provider: { type: String },
        completion_date: { type: Date },
        id: { type: String },
        _id: false,
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        start_date: { type: Date },
        end_date: { type: Date },
        cgpa_or_percentage: { type: Number },
        description: [String],
        id: { type: String },
        _id: false,
      },
    ],
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: Date },
        end_date: { type: Date },
        yearsofexperience: { type: Number },
        description: [String],
        id: { type: Number },
        currently_working: { type: Boolean },
        _id: false,
      },
    ],

    publications: [
      {
        id: { type: String },
        name: { type: String },
        link: { type: String },
        date: { type: Date },
        _id: false,
      },
    ],
    skills: [
      {
        skill_name: { type: String },
        skill_proficiency: { type: String },
        _id: false,
      },
    ],
    personal_projects: [
      {
        id: { type: String }, // Add this line
        name: { type: String },
        description: [String], // Change this from [String] to String
        link: { type: String },
        start_date: { type: Date },
        end_date: { type: Date },
        _id: false,
      },
    ],
    awards_and_achievements: [String],
    position_of_responsibility: [
      {
        id: { type: String },
        title: { type: String },
        organization: { type: String },
        start_date: { type: Date },
        end_date: { type: Date },
        description: [String],
        _id: false,
      },
    ],
    competitions: [
      {
        id: { type: String },
        name: { type: String },
        description: [String],
        date: { type: Date },
        _id: false,
      },
    ],
    extra_curricular_activities: [String],
    total_experience: { type: Number },
  },
  { timestamps: true }
); // Adding timestamps for createdAt and updatedAt fields

// Create and export the model
const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
