const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const yaml = require("js-yaml");
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '..', 'config', 'dev.yaml');
const config = yaml.load(fs.readFileSync(configPath, "utf8"));
// services

let emailServiceEnabled;
try {
  emailServiceEnabled = config.emailService;  // Extract emailService flag
} catch (error) {
  console.error("Error loading YAML config:", error);
  process.exit(1);
}
let openAIServiceEnabled;
try {
  openAIServiceEnabled = config.evaluationByGPT;  
} catch (error) {
  console.error("Error loading YAML config:", error);
  process.exit(1);
}
let azureServiceEnabled;
try {

  azureServiceEnabled = config.azureService; 
} catch (error) {
  console.error("Error loading YAML config:", error);
  process.exit(1);
}

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
const userProfileRoutes = require("./routes/userProfiles");

// Use your authentication routes
  app.use("/api/auth", authRoutes);
 // Import your authentication routes



// Use interview routes
app.use("/api/interview", interviewRoutes);

if(azureServiceEnabled){
  const azureRoutes = require("./routes/azure");

// Use azure routes
app.use("/api/azure", azureRoutes);

}else{
   console.log("Azure service is disabled.");
}

if(openAIServiceEnabled){
  const openAIRoutes = require("./routes/openAI");

// Use open AI routes

app.use("/api/openai", openAIRoutes);

}else{
   console.log("OpenAI service is disabled.");
}


// Use job routes
app.use("/api", jobRoutes);

// Use question routes
app.use("/api", questionRoutes);

app.use("/api/user-profile", userProfileRoutes);

// Define and use other routes here

// Define other server setup, middleware, and error handling as needed

// Start the server
const port = process.env.PORT || 3000;
console.log("Port: ", port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
