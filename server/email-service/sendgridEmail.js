const sgMail = require("@sendgrid/mail");
const fs = require("fs");
require("dotenv").config();

console.log("SENDGRID_API_KEY: ", process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Load the HTML template from a file
const htmlTemplate = fs.readFileSync("../assets/email-template.html", "utf8");

// Replace the placeholder with the actual name
const customName = "Anirudh"; // Replace "John" with the desired name
let customizedHtml = htmlTemplate.replace(/Jane/g, customName);
customizedHtml = customizedHtml.replace(/{verification_link}/g, "https://www.google.com");

const msg = {
  to: "anirudhcode7@gmail.com", // Replace with the recipient's email
  from: "noreply@ruthi.in", // Replace with your verified sender email
  subject: "Sending with SendGrid is Fun",
  html: customizedHtml, // Use the customized HTML content
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
