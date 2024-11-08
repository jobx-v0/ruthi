const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const  rateLimiter  = require('../middleware/rateLimiter')

//Google OAuth authentication 
router.post("/google-auth", AuthController.googleAuth);

// Register a new user
router.post("/register", AuthController.register);

// Log in an existing user
router.post("/login", AuthController.login);

// Get User data based on authToken
router.get("/user/info", authMiddleware, AuthController.getUser);

// Route to verify email
router.post("/verify-email", AuthController.verifyEmail);

router.post('/resend-verification-email',rateLimiter, AuthController.resendVerificationEmail);

//Route to send reset-password link
router.post('/forgot-password',rateLimiter, AuthController.forgotPassword);

// Route to reset password
router.post('/reset-password', AuthController.resetPassword);

// Route to update user profile
router.put('/update', authMiddleware, AuthController.updateUser);

// Other authentication-related routes can be added here

module.exports = router;
