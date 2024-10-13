const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

//require("./cron-jobs/processCompletedInterviews");

const app = express();
app.use(cors());

app.use(bodyParser.json());

require("./config/db");

const authRoutes = require("./routes/auth");
//const interviewRoutes = require("./routes/interview");
const jobRoutes = require("./routes/job");
const questionRoutes = require("./routes/question");
//const azureRoutes = require("./routes/azure");
//const openAIRoutes = require("./routes/openAI");
const userProfileRoutes = require("./routes/userProfiles");

// Use your authentication routes
app.use("/api/auth", authRoutes);

// Use interview routes
//app.use("/api/interview", interviewRoutes);

// Use azure routes
//app.use("/api/azure", azureRoutes);

// Use open AI routes
//app.use("/api/openai", openAIRoutes);

// Use job routes
app.use("/api", jobRoutes);

// Use question routes
app.use("/api", questionRoutes);

app.use("/api/user-profile", userProfileRoutes);

// Start the server
const port = process.env.PORT || 3001;
console.log("Port: ", port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
