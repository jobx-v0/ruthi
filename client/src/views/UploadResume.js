import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {
  Upload,
  Linkedin,
  FileText,
  User,
  CheckCircle,
  Briefcase,
  ArrowRight,
  Loader,
} from "lucide-react";

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
  isSubmittedState,
} from "../store/atoms/userProfileSate";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/resume";

export default function Component() {
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("File state updated:", file);
  }, [file]);

  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate("/login");
    return;
  }

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
  const setIsSubmitted = useSetRecoilState(isSubmittedState);

  const handleContinueClick = async () => {
    if (file) {
      setIsLoading(true);
      console.log("File uploaded:", file);

      // Simulate API call with a 5-second delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Hardcoded response
      const hardcodedResponse = {
        personal_information: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "1234567890",
        },
        socials: {
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
          twitter: "https://twitter.com/johndoe",
          website: "https://johndoe.com",
        },
        courses: [
          {
            course_name: "Web Development Bootcamp",
            course_link: "https://example.com/webdev",
            course_provider: "Udemy",
            completion_date: "2023-05-15",
          },
        ],
        education: [
          {
            institution: "University of Example",
            degree: "Bachelor of Science in Computer Science",
            start_date: "2018-09-01",
            end_date: "2022-05-31",
            cgpa_or_percentage: "3.8",
            description: ["Dean's List", "Graduated with Honors"],
          },
        ],
        experience: [
          {
            company: "Tech Solutions Inc.",
            position: "Software Developer",
            start_date: "2022-06-01",
            // end_date: "Present",
            currently_working: true,
            description: [
              "Developed web applications using React and Node.js",
              "Implemented RESTful APIs",
            ],
          },
        ],
        publications: [
          {
            name: "Introduction to Machine Learning",
            link: "https://example.com/ml-paper",
            date: "2023-03-01",
          },
        ],
        skills: [
          { skill_name: "JavaScript", skill_proficiency: "Expert" },
          { skill_name: "Python", skill_proficiency: "Intermediate" },
        ],
        personal_projects: [
          {
            name: "Personal Portfolio Website",
            description: [
              "Designed and developed a responsive portfolio website",
              "Implemented dark mode",
            ],
            link: "https://johndoe-portfolio.com",
            start_date: "2023-01-01",
            end_date: "2023-02-28",
          },
        ],
        awards_and_achievements: [
          "Best Hackathon Project 2022",
          "Dean's Honor Roll 2020-2022",
        ],
        positions_of_responsibility: [
          {
            title: "President",
            organization: "Computer Science Club",
            start_date: "2021-09-01",
            end_date: "2022-05-31",
            description: [
              "Organized coding workshops",
              "Managed a team of 10 members",
            ],
          },
        ],
        competitions: [
          {
            name: "ACM ICPC Regional Finalist",
            date: "2021-12-01",
            description: "Participated in ACM ICPC regionals and advanced to the finals."
          },
          {
            name: "Google Code Jam Qualifier",
            date: "2022-04-25",
            description: "Qualified for the Google Code Jam with a score in the top 5%."
          }
        ],
        extracurricular_activities: [
          "Volunteer at local coding bootcamp for underprivileged youth",
          "Member of university chess club",
        ],
      };

      // Update Recoil atoms with hardcoded data
      setPersonalInformation(hardcodedResponse.personal_information);
      setSocials(hardcodedResponse.socials);
      setCourses(hardcodedResponse.courses);
      setEducation(hardcodedResponse.education);
      setExperience(hardcodedResponse.experience);
      setPublications(hardcodedResponse.publications);
      setSkills(hardcodedResponse.skills);
      setPersonalProjects(hardcodedResponse.personal_projects);
      setAwardsAndAchievements(hardcodedResponse.awards_and_achievements);
      setPositionsOfResponsibility(
        hardcodedResponse.positions_of_responsibility
      );
      setCompetitions(hardcodedResponse.competitions);
      setExtracurricularActivities(
        hardcodedResponse.extracurricular_activities
      );
      console.log("User profile updated with hardcoded data");

      setIsLoading(false);
      navigate("/profile");
    } else if (linkedinUrl !== "") {
      // Connect with LinkedIn
      console.log("LinkedIn connected:", linkedinUrl);
    }
  };

  const handleLinkedinChange = (event) => {
    setLinkedinUrl(event.target.value);
  };

  const processSteps = [
    {
      icon: <User className="w-6 h-6" />,
      text: "Sign up and complete your profile: Upload your resume or connect your LinkedIn to get started quickly.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Take our tests and interviews: Showcase your skills through our tailored assessments.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      text: "Receive job offers or apply for jobs: Get matched with companies looking for your specific skill set.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Start working on your dream job! Begin your new career journey with confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <Loader className="w-12 h-12 text-orange-600 animate-spin" />
            <p className="mt-4 text-lg font-semibold text-gray-700">Processing your resume...</p>
          </div>
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
                  Upload your resume or add your LinkedIn URL to get started.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-600 transition-colors duration-300">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex flex-col items-center space-y-2">
                    <FileText className="w-12 h-12 text-orange-600" />
                    <span className="text-orange-600 font-medium">
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
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-12 h-12 text-orange-600" />
                    <span className="text-orange-600 font-medium">
                      Drop resume or click to browse
                    </span>
                    <span className="text-sm text-gray-500">
                      PDF or DOC, max 5MB
                    </span>
                  </label>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your LinkedIn profile URL"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  className="text-gray-600 hover:text-orange-600 font-medium"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Skip for now
                </button>
                <button
                  className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
                  onClick={handleContinueClick}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                    "Upload your resume or LinkedIn profile",
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