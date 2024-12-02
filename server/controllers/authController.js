const User = require("../models/User");
const UnverifiedUser = require("../models/Unverified.js"); // Import the UnverifiedUser model
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const EmailService = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");
const limiter = require('../middleware/rateLimiter');
const mode = process.env.MODE;
require("dotenv").config();

// Register a new user
register = async (req, res) => {
  try {
    // Retrieve user data from the request body
    const { username, password, email, role, companyName } = req.body;
    // Check if the username or password is missing
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ username });
    const existingUserWithmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already in use." });
    }
    if (existingUserWithmail) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    if (mode=='dev') {
      // In dev mode, bypass email verification and save directly to the main User collection
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        email,
        role,
        companyName,
        isVerified: true, // Automatically verified in dev mode
      });
      await newUser.save();
      console.log("New User Saved in Dev Mode");
      return res.status(201).json({ message: "Registration successful!" });
    }
    if (mode != 'dev') {
      // If not in devMode, store the user in the UnverifiedUser collection
      const unverifiedUser = new UnverifiedUser({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        email,
        role,
        companyName,
        isVerified: false // Only for employers
      });
    
      await unverifiedUser.save(); // Save the unverified user to the UnverifiedUser collection
      await EmailService.sendVerificationEmail(unverifiedUser); // Send verification email to unverified user
    
      console.log("New Unverified User Saved");
    
      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify your account.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};


// Log in an existing user
login = async (req, res) => {
  try {
    console.log(req.body);

    // Retrieve user data from the request body
    const { username, password } = req.body;

    // Check if the username or password is missing
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Find the user in the database by their username
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "You are not verified.", email: user.email });
    }

    // Verify the user's password using the virtual 'password' field
    if (user.authenticate(password)) {
      // Password is correct, generate a JWT token
      const secretKey = process.env.JWT_TOKEN_SECRET_KEY;
      const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
        expiresIn: "12h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

verifyEmail = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).send("Invalid or missing token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
    const userId = decoded._id || decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.isVerified) {
      return res.status(400).send("Email is already verified");
    }

    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .send({ message: "Email verified successfully!", token });
  } catch (error) {
    return res.status(400).send("Invalid or expired token");
  }
};

// Forgot Password Endpoint
forgotPassword = [
  limiter,
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await EmailService.sendPasswordResetMail(user);
      res.json({ message: "Password reset link sent" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  },
];

resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
    console.log("decoded", decoded);
    const userId = decoded._id || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password; // Assuming password is hashed in pre-save middleware
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

getUser = async (req, res) => {
  try {
    // Fetch user info based on the authenticated user
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Extract username and send it in the response
    res.json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
};

resendVerificationEmail = [
  limiter,
  async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified." });
      }

      // Send verification email again
      await EmailService.sendVerificationEmail(user);
      res.status(200).json({ message: "Verification email sent." });
    } catch (error) {
      console.error("Error resending verification email:", error);
      res.status(500).json({ message: "Failed to resend verification email." });
    }
  },
];

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

googleAuth = async (req, res) => {
  try {
    const { token, role } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Ensure the Google Client ID is correct
    });

    const payload = ticket.getPayload();
    console.log("Google Payload:", payload);

    const { email, name, picture, sub } = payload;
    const usernameFromEmail = email.split("@")[0];

    // Check if the user already exists in the database by email
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists, generate a token and return it for login
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: existingUser,
      });
    }

    // Check if the username already exists, to prevent duplicates
    // let usernameExists = await User.findOne({ username: name });
    // if (usernameExists) {
    //   return res.status(400).json({
    //     message: "Username already taken. Please choose a different one.",
    //   });
    // }

    // Create a new user if they do not already exist
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: usernameFromEmail,
      email: email,
      isVerified: true, // Since Google already verified their email
      role: "candidate", // Adjust role as needed
      hashed_password: "", // No password for Google-authenticated users
      salt: "", // No salt needed
      isGoogleAuth: true,
      picture: picture, // Store profile picture from Google
      created_at: Date.now(),
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const newUsertoken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return the newly created user and token
    return res.json({
      message: "Registration successful",
      token: newUsertoken,
      user: newUser,
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

updateUser = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updateData = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const AuthController = {
  register,
  login,
  getUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  googleAuth,
  updateUser,
};

module.exports = AuthController;
