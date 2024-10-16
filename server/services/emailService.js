const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");// Adjust the path as needed
const yaml= require("js-yaml"); 
let emailServiceConfig
try {
  const configPath = path.join(__dirname, "config\dev.config.yaml");
  const config = yaml.load(fs.readFileSync(configPath, "utf8"));
  let emailServiceConfig = config.app.emailService;  // Extract azureService config
} catch (error) {
  console.error("Error loading YAML config:", error);
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
    if (emailServiceConfig) { // Check if emailService is true
        try {
            const token = jwt.sign(
                { userId: user._id }, // Payload
                process.env.JWT_TOKEN_SECRET_KEY, // Secret key
                { expiresIn: "24h" } // Token expires in 24 hours
            );

            const verificationLink = `${process.env.DOMAIN}:${process.env.FRONTEND_PORT}/verification?token=${token}`;

            const htmlTemplate = fs.readFileSync(path.join(__dirname, "../assets/email-template.html"), "utf8");
            const customizedHtml = htmlTemplate
                .replace(/Jane/g, user.username)
                .replace(/{verification_link}/g, verificationLink);

            const msg = {
                to: user.email,
                from: "noreply@ruthi.in",
                subject: "Email Verification",
                html: customizedHtml,
            };

            await sgMail.send(msg);
            console.log("Verification email sent to:", user.email);
        } catch (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Could not send verification email");
        }
    } else {
        console.log("Email verification is not required as emailService is disabled.");
    }
};


const sendPasswordResetMail = async (user) => {
    try {
        const token = jwt.sign(
            { userId: user._id }, // Payload
            process.env.JWT_TOKEN_SECRET_KEY, // Secret key
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        const resetLink = `${process.env.DOMAIN}:${process.env.FRONTEND_PORT}/reset-password?token=${token}`;
        const htmlTemplate = fs.readFileSync(path.join(__dirname, "../assets/password-reset-email.html"), "utf8");
        const customizedHtml = htmlTemplate
            .replace(/Jane/g, user.username)
            .replace(/{reset_link}/g, resetLink);

        const msg = {
            to: user.email,
            from: "noreply@ruthi.in",
            subject: "Ruthi: Password Reset",
            html: customizedHtml,
        };

        await sgMail.send(msg);
        console.log("Password reset email sent to:", user.email);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Could not send password reset email");
    }

}

const EmailService = {
    sendVerificationEmail,
    sendPasswordResetMail
};

module.exports = EmailService;
