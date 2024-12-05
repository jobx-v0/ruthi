const express = require("express");
const JobAppliedController = require("../controllers/jobAppliedController");
// const CreateApplicationRoute=require('../controllers/jobAppliedController')
const router = express.Router();

router.post("/jobApplications", JobAppliedController.createApplication);

router.get("/jobApplications/all", JobAppliedController.getAppliedCandidates);
4;

router.put("/update-stage", JobAppliedController.updateApplicationStage);

// Get Hiring Stages for a Candidate
router.get("/:id/stages", JobAppliedController.getStages);

//CRUD routes for Notes
router.post("/:applicationId/notes", JobAppliedController.addNote);

router.get("/:applicationId/notes", JobAppliedController.getNotes);

router.delete("/:applicationId/notes/:noteId", JobAppliedController.deleteNote);

router.put("/:applicationId/notes/:noteId", JobAppliedController.updateNote);

module.exports = router;
