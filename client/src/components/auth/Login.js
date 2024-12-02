import { useState } from "react";
import { loginFields } from "../../constants/formFields";
import FormAction from "../FormAction";
import InputField from "../Input";
import { loginUserAPI } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Ruthi_full_Logo from "../../assets/Ruthi_full_Logo.png";
import { TextGenerateEffect } from "../../ui/text-generate-effect";
import { Checkbox } from "@nextui-org/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { fetchUserProfile } from "../../api/userProfileApi";
import { useCustomToast } from "../utils/useCustomToast";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const { setToken } = useAuth();
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();
  const customToast = useCustomToast();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUserAPI(loginState);

      if (result.success) {
        setToken(result.token);
        const isProfileSubmitted = result.userData.isProfileSubmitted;
        const isParsedResume = result.userData.isParsedResume;

        const redirectPath = sessionStorage.getItem("redirectPath");

        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem("redirectPath");
        } else if (isProfileSubmitted) {
          navigate("/profile");
        } else if (!isParsedResume) {
          navigate("/uploadResume");
        } else {
          navigate("/profile");
        }
      } else {
        console.log("errorcode: ", result.errorCode);
        if (result.errorCode === 403) {
          console.log("email got login side: ", result);
          navigate("/verify-email-prompt", { state: { email: result.email } });
        }
        customToast(result.error || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      console.error(error);
      customToast(
        "An unexpected error occurred. Please try again later.",
        "error"
      );
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const role = "candidate";
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/google-auth`,
        {
          token: credentialResponse.credential,
          role: role,
        }
      );

      if (response.data && response.data.token) {
        setToken(response.data.token);

        customToast("Login successful!", "success");

        console.log("user id from google login", response.data);

        try {
          const userProfile = await fetchUserProfile(response.data.token);
          if (userProfile && Object.keys(userProfile).length > 0) {
            navigate("/profile", { replace: true });
          } else {
            navigate("/uploadResume", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          navigate("/uploadResume", { replace: true });
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      customToast(
        "Authentication failed. Please Signup as a new user",
        "error"
      );
    }
  };

  const words = "Welcome back! Please enter your details.";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side Content */}
      <div className="w-full lg:w-1/2 text-white p-8 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-transparent">
        <img
          src={Ruthi_full_Logo}
          alt="Ruthi Logo"
          className="w-24 lg:w-48 h-auto"
        />
        <div className="text-xl leading-relaxed text-center max-w-md relative hidden lg:block">
          <TextGenerateEffect duration={2} filter={false} words={words} />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
            Sign In
          </h2>

          {/* Google Auth Button */}
          <div className="flex justify-center mb-6">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => customToast("Google Login Failed", "error")}
              />
            </GoogleOAuthProvider>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <InputField
                key={field.id}
                handleChange={handleChange}
                value={loginState[field.id]}
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

            {/* Remember me & Forgot password with spacing */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4 sm:gap-y-0 sm:gap-x-4 p-4">
              <Checkbox defaultSelected radius="sm" color="primary" size="sm">
                Remember me
              </Checkbox>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <FormAction
              handleSubmit={handleSubmit}
              text="Sign In"
              customStyles="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            />
          </form>

          <p className="mt-8 text-sm text-gray-600 text-center">
            Not a user?{" "}
            <a href="/signup" className="text-blue-700 font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
