const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new user profile
router.post('/create', userProfileController.createProfile);

// Update a user profile by ID
router.put('/', authMiddleware, userProfileController.updateProfile);

// Delete a user profile by ID
router.delete('/', authMiddleware, userProfileController.deleteProfile);

router.get('/', authMiddleware, userProfileController.getUserProfile);

module.exports = router;
