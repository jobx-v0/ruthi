const Application = require('../models/JobsApplied');
const UserProfile = require('../models/UserProfile');
const Job = require("../models/Job");

const createApplication = async (req, res) => {
    try {
        const { userProfile, job, appliedDate, stage } = req.body;

        const newApplication = new Application({
            userProfile,
            job,
            appliedDate,
            stage
        });
        await newApplication.save();

        // Fetch details for displaying in frontend
        const [userProfileDetails, jobDetails] = await Promise.all([
            UserProfile.findById(userProfile, 'personal_information.first_name personal_information.email personal_information.phone'),
            Job.findById(job, 'title location')
        ]);

        // The final Response
        const applicationDetails = {
            userId: newApplication._id,
            appliedRole: jobDetails ? jobDetails.title : "N/A",
            appliedLocation: jobDetails ? jobDetails.location : "N/A",
            userName: userProfileDetails ? userProfileDetails.personal_information.first_name : "N/A",
            userEmail: userProfileDetails ? userProfileDetails.personal_information.email : "N/A",
            userPhone: userProfileDetails ? userProfileDetails.personal_information.phone : "N/A",
            appliedDate: newApplication.appliedDate,
            applicationStage: newApplication.stage
        };

        return res.status(201).json({
            message: 'Application created Successfully',
            application: applicationDetails
        });
    } catch (error) {
        console.error('Error creating application:', error);
        return res.status(400).json({ message: error.message });
    }
};

// Get all jobs applied candidates
const getAppliedCandidates = async (req, res) => {
    try {
        // Fetch all applications
        const applications = await Application.find({});

        // Map through each application to fetch associated details
        const appliedApplications = await Promise.all(applications.map(async (application) => {
            const [userProfileDetails, jobDetails] = await Promise.all([
                UserProfile.findById(application.userProfile, 'personal_information.first_name personal_information.email personal_information.phone'),
                Job.findById(application.job, 'title location')
            ]);

            // Format each application with desired fields and handle missing details
            return {
                userId: application._id,
                appliedRole: jobDetails ? jobDetails.title : "N/A",
                appliedLocation: jobDetails ? jobDetails.location : "N/A",
                userName: userProfileDetails ? userProfileDetails.personal_information.first_name : "N/A",
                userEmail: userProfileDetails ? userProfileDetails.personal_information.email : "N/A",
                userPhone: userProfileDetails ? userProfileDetails.personal_information.phone : "N/A",
                appliedDate: application.appliedDate,
                applicationStage: application.stage
            };
        }));

        // Return the response with all formatted applied applications
        return res.status(200).json({
            message: 'All applied candidates',
            appliedApplications
        });
    } catch (error) {
        console.error('Error getting applied candidates:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createApplication,
    getAppliedCandidates
};
