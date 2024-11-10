const Application = require("../models/JobsApplied");
const UserProfile = require("../models/UserProfile");
const Job = require("../models/Job");

const createApplication = async (req, res) => {
  try {
    const { userProfile, job, appliedDate, stage } = req.body;

    const applicationStage = {
      applied: true,
      profileScreening: false,
      shortlisted: false,
      interview1: false,
      interview2: false,
      finalInterview: false,
    };

    const newApplication = new Application({
      userProfile,
      job,
      appliedDate,
      currentStage,
      stage: applicationStage,
    });
    await newApplication.save();

    // Fetch details for displaying in frontend
    const [userProfileDetails, jobDetails] = await Promise.all([
      UserProfile.findById(
        userProfile,
        "personal_information.first_name personal_information.email personal_information.phone"
      ),
      Job.findById(job, "title location"),
    ]);

    // The final Response
    const applicationDetails = {
      userId: newApplication._id,
      appliedRole: jobDetails ? jobDetails.title : "N/A",
      appliedLocation: jobDetails ? jobDetails.location : "N/A",
      userName: userProfileDetails
        ? userProfileDetails.personal_information.first_name
        : "N/A",
      userEmail: userProfileDetails
        ? userProfileDetails.personal_information.email
        : "N/A",
      userPhone: userProfileDetails
        ? userProfileDetails.personal_information.phone
        : "N/A",
      appliedDate: newApplication.appliedDate,
      applicationStage: newApplication.currentStage,
      linkedin: userProfileDetails.socials
        ? userProfileDetails.socials.linkedin
        : "N/A", // Included only if user has provided socials in their profile
      github: userProfileDetails.socials
        ? userProfileDetails.socials.github
        : "N/A",
    };

    return res.status(201).json({
      message: "Application created Successfully",
      application: applicationDetails,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get all jobs applied candidates
const getAppliedCandidates = async (req, res) => {
  try {
    // Fetch all applications
    const applications = await Application.find({});

    // Map through each application to fetch associated details
    const appliedApplications = await Promise.all(
      applications.map(async (application) => {
        const [userProfileDetails, jobDetails] = await Promise.all([
          UserProfile.findById(
            application.userProfile,
            "personal_information.first_name personal_information.email personal_information.phone socials.linkedin socials.github skills"
          ),
          Job.findById(application.job, "title location employment_type"),
        ]);
        const skillsArray = userProfileDetails
          ? userProfileDetails.skills.map((skill) => ({
              name: skill.skill_name,
              proficiency: skill.skill_proficiency,
            }))
          : [];

        // Format each application with desired fields and handle missing details
        return {
          _id: application._id,
          appliedRole: jobDetails ? jobDetails.title : "N/A",
          appliedLocation: jobDetails ? jobDetails.location : "N/A",
          userName: userProfileDetails
            ? userProfileDetails.personal_information.first_name
            : "N/A",
          userEmail: userProfileDetails
            ? userProfileDetails.personal_information.email
            : "N/A",
          userPhone: userProfileDetails
            ? userProfileDetails.personal_information.phone
            : "N/A",
          appliedDate: application.appliedDate,
          applicationStage: application.currentStage,
          employment_type: jobDetails.employment_type ? jobDetails.employment_type : "N/A",
          socials: userProfileDetails ? userProfileDetails.socials : {}, // Included only if user has provided socials in their profile
          skills: skillsArray, // Formated skills as an array for easier use in frontend
          stageDetails: application.stage,
        };
      })
    );

    // Return the response with all formatted applied applications
    return res.status(200).json({
      message: "All applied candidates",
      appliedApplications,
    });
  } catch (error) {
    console.error("Error getting applied candidates:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateApplicationStage = async (req, res) => {
  try {
    const { applicationId, key } = req.body;
    console.log("Request", req.body);

    // Fetch the application document
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the key exists in the application object
    if (application.stage.hasOwnProperty(key)) {
      application.stage[key] = !application.stage[key];
      await application.save();

      return res.status(200).json({
        message: "Application stage updated successfully",
      });
    } else {
      return res.status(400).json({ message: `Stage ${key} not found` });
    }
  } catch (error) {
    console.error("Error updating application stage:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStages = async (req, res) => {
  try {
    const id = req.params.id;
    const stages = await Application.findById(id).select("stage");
    return res.status(200).json(stages);
  } catch (error) {
    console.error("Error getting stages:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getAppliedCandidates,
  updateApplicationStage,
  getStages,
};
