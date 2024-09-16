const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const EmailService = require("../services/emailService");


require("dotenv").config();

// Register a new user
register = async (req, res) => {
  try {
    // Retrieve user data from the request body
    const { username, password, email, role, companyName } = req.body;
    console.log("inside register");
    // Check if the username or password is missing
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    if (!email) {
      return res.status(400).json({ message: "Email are required." });
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username already exists!!!");
      return res.status(400).json({ message: "Username is already in use." });
    }

    // Create a new user document and set the virtual 'password' field
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password,
      email,
      role,
      companyName, // Only for employers
    });

    // Save the user document to the database
    await newUser.save();

    // Send verification email
    await EmailService.sendVerificationEmail(newUser);
    console.log("New User Saved");

    res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// Log in an existing user
login = async (req, res) => {
  try {
    // Retrieve user data from the request body
    const { username, password } = req.body;

    // Check if the username or password is missing
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Find the user in the database by their username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the user's password using the virtual 'password' field
    if (user.authenticate(password)) {
      // Password is correct, generate a JWT token
      const secretKey = process.env.JWT_TOKEN_SECRET_KEY;
      const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
        expiresIn: "12h",
      });
      console.log("Authenticated new user");
      // Send the token in the response
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
      const user = await User.findById(decoded.userId);

      if (!user) {
          return res.status(404).send("User not found");
      }

      if (user.isVerified) {
          return res.status(400).send("Email is already verified");
      }

      user.isVerified = true;
      await user.save();

      return res.status(200).send("Email verified successfully!");
  } catch (error) {
      return res.status(400).send("Invalid or expired token");
  }
};

// Forgot Password Endpoint
forgotPassword = async (req, res) => {
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
};

resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log("hello....")
  try {
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
    console.log("decoded", decoded);
    const user = await User.findById(decoded.userId);

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
    const userId = req.user.id;

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

resendVerificationEmail = async (req, res) => {
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
};

const AuthController = {
  register,
  login,
  getUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail
};

module.exports = AuthController;
