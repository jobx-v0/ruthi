const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

// Create an instance of the Express application
const app = express();
app.use(cors());

// Middleware for parsing JSON and handling CORS
app.use(bodyParser.json());

// Import other routes as needed
const db = require("./config/db"); // Import the database connection

const authRoutes = require("./routes/auth"); // Import your authentication routes
const interviewRoutes = require("./routes/interview");
const jobRoutes = require("./routes/job");
const questionRoutes = require("./routes/question");
const azureRoutes = require("./routes/azure");
const openAIRoutes = require("./routes/openAI");
const userProfileRoutes = require("./routes/userProfiles");

// Use your authentication routes
app.use("/api/auth", authRoutes);

// Use interview routes
app.use("/api/interview", interviewRoutes);

// Use azure routes
app.use("/api/azure", azureRoutes);

// Use open AI routes
app.use("/api/openai", openAIRoutes);

// Use job routes
app.use("/api", jobRoutes);

// Use question routes
app.use("/api", questionRoutes);

app.use("/api/user-profile", userProfileRoutes);

// Define and use other routes here

// Define other server setup, middleware, and error handling as needed

// Start the server
const port = process.env.PORT || 5000;
console.log("Port: ", port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
