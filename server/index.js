const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

require("./cron-jobs/processCompletedInterviews");

const app = express();
app.use(cors());

app.use(bodyParser.json());

require("./config/db");

const authRoutes = require("./routes/auth");
const interviewRoutes = require("./routes/interview");
const resultRoutes = require("./routes/result");
const jobRoutes = require("./routes/job");
const subscribeRoutes = require("./routes/subscription");
const questionRoutes = require("./routes/question");
const azureRoutes = require("./routes/azure");
const openAIRoutes = require("./routes/openAI");
const userProfileRoutes = require("./routes/userProfiles");
const jobsAppliedRoutes=require("./routes/jobsAppliedRoute");

// Use your authentication routes
app.use("/api/auth", authRoutes);

// Use interview routes
app.use("/api/interview", interviewRoutes);

// Use result routes
app.use("/api/result", resultRoutes);

// Use azure routes
app.use("/api/azure", azureRoutes);

// Use open AI routes
app.use("/api/openai", openAIRoutes);

// Use job routes
app.use("/api", jobRoutes);

// Use Subscription routes
app.use("/api", subscribeRoutes);

// Use question routes
app.use("/api", questionRoutes);

app.use("/api/user-profile", userProfileRoutes);

app.use('/api/',jobsAppliedRoutes);

// Start the server
const port = process.env.PORT || 8080;
console.log("Port: ", port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
