import React, { useState, useEffect } from "react";
import {
  candidateSignupFields,
  // employerSignupFields, // Commented out
} from "../../constants/formFields";
import FormAction from "../FormAction";
import { useNavigate } from "react-router-dom";
import { registerUserAPI } from "../../api/authApi";
import InputField from "../Input";
import Ruthi_full_Logo from "../../assets/Ruthi_full_Logo.png";
import { TextGenerateEffect } from "../../ui/text-generate-effect";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { fetchUserProfile } from "../../api/userProfileApi";
import { useAuth } from "../../context/AuthContext";
import { useCustomToast } from "../utils/useCustomToast";

// import { LinkedIn } from 'react-linkedin-login-oauth2';
export default function Signup() {
  const [isEmployer, setIsEmployer] = useState(false); // Commented out
  const [signUpState, setSignUpState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role] = useState("candidate"); // Set to "candidate" by default
  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const { setToken } = useAuth();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // Checkbox state
  const showToast = useCustomToast();

  useEffect(() => {
    const fields = candidateSignupFields;
    const initialState = {};
    fields.forEach((field) => (initialState[field.id] = ""));
    setSignUpState(initialState);
    setIsEmployer(true); // Set to false by default
    // setRole("candidate"); // This line can be removed as role is now set by default
  }, []); // Removed dependency on isEmployer

  const handleChange = (e) => {
    setSignUpState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    // // Company email validation (basic check for non-common domains)
    // if (isEmployer) {
    //   const commonDomains = [
    //     "gmail.com",
    //     "yahoo.com",
    //     "hotmail.com",
    //     "outlook.com",
    //   ];
    //   const domain = email.split("@")[1];
    //   if (commonDomains.includes(domain)) {
    //     return "Please use a company email address";
    //   }
    // }

    return null;
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    var is_valid = true;
    if (!isTermsAccepted) {
      showToast("You must accept the Terms and Conditions.","error");
      return; // Exit early if terms are not accepted
    }
    
    const fields = candidateSignupFields;

    // Create a new object to store the updated sign up state
    let updatedSignUpState = { ...signUpState };

    var password = "";
    // validating input fields
    for (const field of fields) {
      console.log("print fields", field.name);

      // removing existing error message
      field.error = false;
      field.errorMessage = "";

      // updatedSignUpState[field.id + "Error"] = false;

      //checking if value exists or not
      console.log("sign up state", signUpState[field.id]);
      if (!signUpState[field.id]) {
        field.error = true;
        field.errorMessage = `${field.labelText} is required`;
        //updatedSignUpState[field.id + "Error"] = true;
        //updatedSignUpState[field.id + "ErrorMessage"] = `${field.labelText} is required`;
        is_valid = false;
      } else {
        // validate if its a proper username
        if (
          field.name === "username" &&
          !/^[a-z0-9_]+$/.test(signUpState[field.id].trim())
        ) {
          field.error = true;
          field.errorMessage =
            "Username can only contain lowercase letters, numbers, and underscores";
          is_valid = false;
        } else if (field.name === "email") {
          const emailError = validateEmail(signUpState[field.id].trim());
          if (emailError) {
            field.error = true;
            field.errorMessage = emailError;
            is_valid = false;
          }
        } else if (field.name === "password") {
          password = signUpState[field.id];
          if (signUpState[field.id].length < 8) {
            field.error = true;
            field.errorMessage = "Password must be at least 8 characters long";
            is_valid = false;
          } else if (
            /\s/.test(signUpState[field.id]) ||
            signUpState[field.id].includes(",")
          ) {
            field.error = true;
            field.errorMessage =
              "Password should not contain white spaces and commas";
            is_valid = false;
          }
        } else if (
          field.name === "confirm_password" &&
          signUpState[field.id] !== password
        ) {
          field.error = true;
          field.errorMessage = "Passwords do not match";
          is_valid = false;
        }
      }
      // Update the sign up state with the new error states
      setSignUpState(updatedSignUpState);
    }

    if (is_valid) {
      setIsSubmitting(true);
      try {
        const success = await registerUserAPI({
          ...signUpState,
          role: "candidate",
        });
        console.log("signup page info", success);
        
        if(success){
          setTimeout(()=>{
            navigate("/verify-email-prompt", { state: { email: signUpState.email } });
          },2000);
        }
      } catch (error) {
        showToast("An error occurred. Please try again later.", "error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showToast("Please correct the errors in the form.", "error");
    }
  };

  //success handler for Google Auth
  const handleSuccess = async (credentialResponse) => {
    const selectedRole = role;
    try {
      console.log("Credential Response:", credentialResponse);
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded JWT:", decoded);

      const email = decoded.email;

      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/google-auth`,
        {
          token: credentialResponse.credential,
          role: selectedRole,
        }
      );

      console.log("Response from server:", response.data);

      // Check if the response contains a token
      if (
        response.data &&
        (response.data.token || response.data.newUsertoken)
      ) {
        const authToken = response.data.token || response.data.newUsertoken;
        setToken(authToken);

        showToast("Account created successfully! Redirecting...", "success");

        console.log("response.data.userId", response.data);

        // Fetch user profile to check if it exists
        try {
          const userProfile = await fetchUserProfile(authToken);
          if (userProfile && Object.keys(userProfile).length > 0) {
            navigate("/profile", { replace: true });
          } else {
            navigate("/uploadResume", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If there's an error fetching the profile, assume it doesn't exist
          navigate("/uploadResume", { replace: true });
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast(
            `Authentication failed: ${
              error.response.data.message || "Unknown error"
            }`,
            "error"
          );
        } else if (error.request) {
          showToast(
            "No response from server. Please try again later.",
            "error"
          );
        } else {
          showToast("An error occurred. Please try again.", "error");
        }
      } else {
        showToast(error.message || "An unexpected error occurred", "error");
      }
    }
  };

  const fields = candidateSignupFields;
  const words =
    "A platform for job-seekers to practice interviews and get evaluated. Hone your skills and get ready for your dream job with real-time feedback and tailored advice.";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 text-white p-8 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-transparent">
        <div className="flex items-center justify-center mb-8">
          <img
            src={Ruthi_full_Logo}
            alt="Ruthi Logo"
            className="w-24 lg:w-48 h-auto"
          />
        </div>
        <div className="text-base lg:text-xl leading-relaxed text-start max-w-md">
          <TextGenerateEffect duration={2} filter={false} words={words} />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white relative">
        <div className="w-full max-w-md p-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-6 text-center">
            Create an Account
          </h1>

          {/* Google Auth Button */}
          <div className="flex justify-center mb-2">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log("Login Failed")}
              />
            </GoogleOAuthProvider>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmitSignUp} className="space-y-4">
            {fields.map((field) => (
              <InputField
                key={field.id}
                handleChange={handleChange}
                value={signUpState[field.id] || ""}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
                error={field.error}
                errorMessage={field.errorMessage}
              />
            ))}
            {/*create a checkbox for Terms and conditions */}
             
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1"
                checked={isTermsAccepted}
                onChange={(e)=> setIsTermsAccepted(e.target.checked)}//assign.
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the 
                <span
                  onClick={() => window.location.href = '/TermsAndConditons.html'} 
                  className="text-blue-600 cursor-pointer "
                >
                  Terms and Conditions
                </span>
                & 
                <span
                  onClick={() => window.location.href = '/PrivacyPolicy.html'} 
                  className="text-blue-600 cursor-pointer "
                >
                  Privacy Policy
                </span>
              </label>
            </div>

            <div className="mt-2">
              <FormAction
                handleClick={handleSubmitSignUp}
                text="Sign Up"
                loading={isSubmitting}
                customStyles="w-full bg-blue-600 hover:bg-blue-700 text-white"
              />
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already a user?{" "}
            <a href="/login" className="text-blue-700 font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
