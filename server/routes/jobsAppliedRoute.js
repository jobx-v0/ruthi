const express=require('express');
const JobAppliedController=require('../controllers/jobAppliedController');
// const CreateApplicationRoute=require('../controllers/jobAppliedController')
const router=express.Router();

router.post('/jobApplications',JobAppliedController.createApplication);

router.get('/jobApplications/all', JobAppliedController.getAppliedCandidates);

router.put('/update-stage', JobAppliedController.updateApplicationStage);

// Get Hiring Stages for a Candidate
router.get('/:id/stages', JobAppliedController.getStages);

module.exports=router;