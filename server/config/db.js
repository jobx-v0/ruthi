const mongoose = require('mongoose');
require('dotenv').config(); // If you're using environment variables

// Define the database connection URL. You can use environment variables here.
const dbURL = 'mongodb+srv://jobx-dev:exY3k0HJPYtYE9cE@jobx.auduktk.mongodb.net/test' || process.env.MONGODB_URI;

console.log("dbURL: ", dbURL)

// Establish the database connection
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for the database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
