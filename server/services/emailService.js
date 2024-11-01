const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/User"); // Adjust the path as needed

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("Using SendGrid API Key:", process.env.SENDGRID_API_KEY ? "****" : "Not set"); // Log API key status

const sendVerificationEmail = async (user) => {
    try {
        const token = jwt.sign(
            { _id: user._id }, // Payload
            process.env.JWT_TOKEN_SECRET_KEY, // Secret key
            { expiresIn: "1h" } // Token expires in 24 hours
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
        console.error("Error sending verification email:", error.response ? error.response.body : error);
        throw new Error("Could not send verification email");
    }
};

const sendPasswordResetMail = async (user) => {
    try {
        const token = jwt.sign(
            { _id: user._id }, // Payload
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
        console.error("Error sending password reset email:", error.response ? error.response.body : error);
        throw new Error("Could not send password reset email");
    }

}

const EmailService = {
    sendVerificationEmail,
    sendPasswordResetMail
};

module.exports = EmailService;
