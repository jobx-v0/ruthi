import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Upload,
  FileText,
  ArrowRight,
  Zap,
  Smile,
  Brain,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";

import axios from "axios";
import { useSetRecoilState } from "recoil";
import {
  personalInformationState,
  socialsState,
  coursesState,
  educationState,
  experienceState,
  publicationsState,
  skillsState,
  personalProjectsState,
  awardsAndAchievementsState,
  positionsOfResponsibilityState,
  competitionsState,
  extracurricularActivitiesState,
  isParsedResumeState,
} from "../store/atoms/userProfileSate";
import { toast } from "react-toastify";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const AZURE_URL = BACKEND_URL + "/api/azure";
const RESUME_PARSER_URL = process.env.REACT_APP_RESUME_PARSER_URL + "/api/resume";


export default function Component() {
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchUserInfo } = useAuth();

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    { icon: Brain, text: "Warming up our AI brain..." },
    { icon: Zap, text: "Energizing the resume parser..." },
    { icon: FileText, text: "Decoding your career history..." },
    { icon: Rocket, text: "Preparing to launch your profile..." },
    { icon: Smile, text: "Almost there! Polishing the results..." },
  ];

  useEffect(() => {
    console.log("File state updated:", file);
    const authToken = localStorage.getItem("authToken");
    if(!authToken){
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
  }, [file]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prevStep) => (prevStep + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      console.log("File uploaded:", uploadedFile);
      setFile(uploadedFile);
    }
  };

  const setPersonalInformation = useSetRecoilState(personalInformationState);
  const setSocials = useSetRecoilState(socialsState);
  const setCourses = useSetRecoilState(coursesState);
  const setEducation = useSetRecoilState(educationState);
  const setExperience = useSetRecoilState(experienceState);
  const setPublications = useSetRecoilState(publicationsState);
  const setSkills = useSetRecoilState(skillsState);
  const setPersonalProjects = useSetRecoilState(personalProjectsState);
  const setAwardsAndAchievements = useSetRecoilState(
    awardsAndAchievementsState
  );
  const setPositionsOfResponsibility = useSetRecoilState(
    positionsOfResponsibilityState
  );
  const setCompetitions = useSetRecoilState(competitionsState);
  const setExtracurricularActivities = useSetRecoilState(
    extracurricularActivitiesState
  );
  const setIsParsedResume = useSetRecoilState(isParsedResumeState);


  const handleContinueClick = async () => {
    setIsParsedResume(true);
    const userInfo = await fetchUserInfo();
    const userId = userInfo._id;
    if (file) {
      setIsLoading(true);
      console.log("File uploaded:", file);

      const response = await axios.get(`${AZURE_URL}/sas/${userId}`);
      const { sasUrl } = response.data;
      console.log("SAS URL:", sasUrl);

      const blob = new Blob([file], { type: file.type });
      console.log("Blob:", blob);

      await axios.put(sasUrl, blob, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
        },
      });

      const res = await axios.get(`${RESUME_PARSER_URL}/health_check`);
      console.log("RESUME_PARSER_URL:", RESUME_PARSER_URL);
      console.log("Health check response:", res);

      const formData = new FormData();
      formData.append("file", file, file.name);
      console.log("Form data:", formData);
      
      try {
        const extract = await axios.post(
          `${RESUME_PARSER_URL}/parse-resume`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Extract response:", extract);

        const parsedData = extract.data.parsed_data;

        // Update Recoil atoms with parsed data
        setPersonalInformation(parsedData.personal_information || []);
        setSocials(parsedData.socials || []);
        setCourses(parsedData.courses || []);
        setEducation(parsedData.education || []);
        setExperience(parsedData.experience || []);
        setPublications(parsedData.publications || []);
        setSkills(parsedData.skills || []);
        setPersonalProjects(parsedData.personal_projects || []);
        setAwardsAndAchievements(parsedData.awards_and_achievements || []);
        setPositionsOfResponsibility(parsedData.position_of_responsibility || []);
        setCompetitions(parsedData.competitions || []);
        setExtracurricularActivities(parsedData.extra_curricular_activities || []);
        console.log("User profile updated with parsed data");

        setIsLoading(false);
        navigate("/profile");
      } catch (error) {
        console.error("Error parsing resume:", error);
        setIsLoading(false);
        // Handle error (e.g., show error message to user)
      }
    } else if (linkedinUrl !== "") {
      // Connect with LinkedIn
      console.log("LinkedIn connected:", linkedinUrl);
    }
  };

  const handleLinkedinChange = (event) => {
    setLinkedinUrl(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md w-full"
          >
            <div className="w-48 h-48 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-orange-200 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border-4 border-orange-400 rounded-full"
              />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-4 border-orange-600 rounded-full"
              />
              <motion.div 
                key={loadingStep}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {React.createElement(loadingSteps[loadingStep].icon, { className: "w-16 h-16 text-orange-500" })}
              </motion.div>
            </div>
            <motion.p 
              key={loadingStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-lg font-semibold text-gray-700 text-center"
            >
              {loadingSteps[loadingStep].text}
            </motion.p>
            <p className="mt-2 text-sm text-gray-500 text-center">
              This might take a minute. Why not grab a coffee?
            </p>
            {/* <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="mt-4"
            >
              <Coffee className="w-8 h-8 text-orange-400" />
            </motion.div> */}
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Resume Upload */}
            <div className="md:w-1/2 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-2 text-orange-600" />
                  Quick Profile Setup
                </h1>
                <p className="text-gray-600">
                  Upload your resume to get started.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-600 transition-colors duration-300">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex flex-col items-center space-y-4">
                    <FileText className="w-16 h-16 text-orange-600" />
                    <span className="text-orange-600 font-medium text-lg">
                      {file.name}
                    </span>
                    <button
                      onClick={() => setFile(null)}
                      className="text-sm text-gray-500 hover:text-orange-600"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <Upload className="w-16 h-16 text-orange-600" />
                    <span className="text-orange-600 font-medium text-lg">
                      Drop resume or click to browse
                    </span>
                    <span className="text-sm text-gray-500">
                      PDF or DOC, max 5MB
                    </span>
                  </label>
                )}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  className="text-gray-600 hover:text-orange-600 font-medium"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Skip for now
                </button>
                <button
                  className="bg-orange-400 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 flex items-center text-lg"
                  onClick={handleContinueClick}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right side - How it works */}
            <div className="md:w-1/2 bg-gray-50 p-8 flex items-center">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  How it works
                </h2>
                <ul className="space-y-4">
                  {[
                    "Upload your resume",
                    "We'll extract your information automatically",
                    "Review and enhance your profile",
                    "Start applying for jobs!",
                  ].map((step, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}