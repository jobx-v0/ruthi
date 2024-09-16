import { useState } from "react";
import { loginFields } from "../../constants/formFields";
import FormAction from "../FormAction";
import InputField from "../Input";
import NotificationBanner from "../NotificationBanner";
import useNotification from "../../services/useNotification";
import { loginUserAPI } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Ruthi_full_Logo from "../../assets/Ruthi_full_Logo.png";
import { TextGenerateEffect } from "../../ui/text-generate-effect";

// import {Input} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const { setToken, setUserInfo } = useAuth();
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();

  const { notification, showNotification, closeNotification } =
    useNotification();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    loginUserAPI(loginState, showNotification, setToken, setUserInfo, navigate);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };
  const words = "Welcome back! Please enter your details.";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      {/* Left Side Content*/}
      <div className="w-full lg:w-[55%] text-white p-4 lg:p-6 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-transparent">
        <div className="flex items-center justify-center mr-14">
          <img
            src={Ruthi_full_Logo}
            alt="Ruthi Logo"
            className="w-24 lg:w-64 h-auto mb-3"
          />
        </div>
        <p className="text-base lg:text-xl leading-relaxed text-start">
          <TextGenerateEffect duration={2} filter={false} words={words} />
        </p>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 lg:p-8 relative">
        <div className="relative p-4 lg:p-6 rounded-lg w-full max-w-md z-10 lg:mr-8 shadow-2xl bg-white opacity-85">
          <h2 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-4">
            Sign In
          </h2>
          <form className="space-y-3 mb-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-2 sm:mb-0">
                <Checkbox defaultSelected radius="sm" color="primary" size="sm">
                  Remember me
                </Checkbox>
              </div>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>
            <FormAction
              handleClick={handleClick}
              text="Sign In"
              customStyles="w-full bg-blue-600 hover:bg-blue-700 text-white"
            />
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
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
