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
      // currentStage,
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
      linkedin: userProfileDetails.socials.linkedin
        ? userProfileDetails.socials.linkedin
        : "N/A", // Included only if user has provided socials in their profile
      github: userProfileDetails.socials.github
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

    // const uniqueJobRoles = new Set();
    const uniqueJobRoles = await Job.distinct("title");

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

        // if (jobDetails && jobDetails.title) {
        //   uniqueJobRoles.add(jobDetails.title);
        // }
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

    const uniqueJobRolesArray = Array.from(uniqueJobRoles);

    // Return the response with all formatted applied applications
    return res.status(200).json({
      message: "All applied candidates",
      appliedApplications,
      uniqueJobRoles,
    });
  } catch (error) {
    console.error("Error getting applied candidates:", error);
    return res.status(500).json({ message: error.message });
  }
};

// const updateApplicationStage = async (req, res) => {
//   try {
//     const { applicationId, key, keyModified } = req.body;

//     // Fetch the application document
//     const application = await Application.findById(applicationId);
//     console.log("Application:", application);

//     if (!application) {
//       return res.status(404).json({ message: "Application not found" });
//     }

//     // Check if the key exists in the application object
//     if (application.stage.hasOwnProperty(key)) {
//       application.stage[key] = !application.stage[key];
//       application.currentStage = keyModified;
//       await application.save();
//       return res.status(200).json({
//         message: "Application stage updated successfully",
//       });
//     } else {
//       return res.status(400).json({ message: `Stage ${key} not found` });
//     }
//   } catch (error) {
//     console.error("Error updating application stage:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const updateApplicationStage = async (req, res) => {
  try {
    const { applicationId, key, keyModified } = req.body;

    // Fetch the application document
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const stages = [
      "applied",
      "profileScreening",
      "shortlisted",
      "interview1",
      "interview2",
      "finalInterview",
    ];

    const lastTrueStageIndex = stages
      .map((stage) => application.stage[stage])
      .lastIndexOf(true);
    console.log("lastTrueStageIndex: ", lastTrueStageIndex);

    const allowedKeys = [
      stages[lastTrueStageIndex],
      stages[lastTrueStageIndex + 1],
    ].filter(Boolean);

    console.log("allowed keys", allowedKeys);

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({
        message: `You cannot modify the ${key} stage. Only ${allowedKeys.join(
          " and "
        )} can be modified.`,
      });
    }

    const index = stages.indexOf(key);

    if (index > 0) {
      if (application.stage[key]) {
        const previousStage = stages[index - 1];
        let keyModified;
        if (previousStage === "applied") keyModified = "Applied";
        if (previousStage === "profileScreening")
          keyModified = "Profile Screening";
        if (previousStage === "shortlisted") keyModified = "Shortlisted";
        if (previousStage === "interview1") keyModified = "Interview 1";
        if (previousStage === "interview2") keyModified = "Interview 2";
        if (previousStage === "finalInterview") keyModified = "Final Interview";

        application.currentStage = keyModified;
        application.stage[key] = !application.stage[key];
      } else {
        application.currentStage = keyModified;
        application.stage[key] = !application.stage[key];
      }
    }

    await application.save();

    return res
      .status(200)
      .json({ message: `Stage ${key} updated successfully` });
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

//CRUD operations for notes
// Add a note to an application
const addNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404).json({ message: "Application Not Found" });
    }

    application.notes.push({ note: req.body.note });
    await application.save();
    const newNote = application.notes[application.notes.length - 1];
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notes for an application
const getNotes = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404).json({ message: "Application Not Found" });
    }
    res.status(201).json({ notes: application.notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404).json({ message: "Application Not Found" });
    }
    const noteIndex = application.notes.findIndex(
      (note) => note._id.toString() === req.params.noteId
    );

    if (noteIndex === -1) {
      res.status(404).json({ message: "Note Not Found" });
    }

    // Remove the note by index
    application.notes.splice(noteIndex, 1);
    await application.save();
    res.status(201).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//edit a specific note
const updateNote = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404).json({ message: "Application Not Found" });
    }

    // Find the note by its _id
    const note = application.notes.find(
      (note) => note._id.toString() === req.params.noteId
    );

    if (!note) {
      res.status(404).json({ message: "Note Not Found" });
    }

    // Update the note content
    note.note = req.body.updatedNote;
    await application.save();
    res.status(201).json({ message: "Note updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getAppliedCandidates,
  updateApplicationStage,
  getStages,
  addNote,
  getNotes,
  deleteNote,
  updateNote,
};
