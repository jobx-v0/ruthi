// Import necessary dependencies
import React, { useEffect, useState } from "react";
import Ruthi_full_Logo from "../assets/Ruthi_full_Logo.png";
import CandidatePng from "../assets/candidate.png";
import RecruiterPng from "../assets/recruiter.png";
import header_bg from "../assets/header-bg.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { PiBagSimpleFill } from "react-icons/pi";
import { TbCheckbox } from "react-icons/tb";
import { toast, Toaster } from "react-hot-toast";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api";

// Nav Component
const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className="py-6 px-8 md:px-16 lg:px-20 flex items-center justify-between overflow-x-hidden">
      {/* Logo */}
      <div
        className="text-2xl font-semibold hover:cursor-pointer flex-shrink-0"
        style={{ color: "#4db8ff" }}
        onClick={() => navigate("/")}
      >
        <img
          src={Ruthi_full_Logo}
          alt="Ruthi Logo"
          className="w-20 sm:w-24 md:w-28 lg:w-36 h-auto"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-4 items-center">
        {/* Login Button */}
        <button
          className="border px-3 sm:px-4 py-1 sm:py-2 rounded-md transition duration-300 hover:shadow-lg"
          style={{ borderColor: "#ff8800", color: "#ff8800" }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        {/* Signup Button */}
        <button
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition duration-300"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const [margin, setMargin] = useState({
    marginTop: "0px",
    marginBottom: "0px",
  });
  const [isScreen1050, setIsScreen1050] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);

      if (window.innerWidth < 450) {
        setMargin({ marginTop: "150px", marginBottom: "150px" });
      } else {
        setMargin({ marginTop: "0px", marginBottom: "0px" });
      }

      if (window.innerWidth < 1050) {
        setIsScreen1050(true);
      } else {
        setIsScreen1050(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`flex flex-col md:grid ${
        isScreen1050 ? "md:grid-cols-1" : "md:grid-cols-2 md:gap-8"
      }  items-center w-full max-w-6xl mx-auto p-4`}
    >
      <div
        className={`space-y-6 text-center ${
          isScreen1050 ? "px-14 py-16" : "md:text-left"
        } `}
        style={{
          marginTop: margin.marginTop,
          marginBottom: margin.marginBottom,
        }}
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800"
          style={{
            animation: "fadeInUp 1s ease-out forwards",
            transform: "translateY(20px)",
            opacity: 0,
          }}
        >
          <span className="font-normal">Welcome To Ruthi</span>
          <br />
          <span className="block mt-2" style={{ lineHeight: "3rem" }}>
            Connecting Talent With Opportunity
          </span>
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed"
          style={{
            animation: "fadeInUp 1s ease-out forwards",
            animationDelay: "0.2s",
            transform: "translateY(20px)",
            opacity: 0,
          }}
        >
          At Ruthi, we bridge the gap between employers and job seekers with our
          innovative solutions. Whether you're looking to hire top talent or
          find your dream job, our platform provides a seamless, efficient, and
          fair hiring experience.
        </p>
        <button
          className="bg-orange-500 text-white py-2 px-6 rounded-md font-medium animate-fadeInUp delay-400 hover:bg-orange-600 transition duration-300"
          onClick={() => navigate("/signup")}
        >
          START NOW
        </button>
      </div>
      <HeaderImage isScreen1050={isScreen1050} />
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </header>
  );
};

// HeaderImage Component
const HeaderImage = ({ isScreen1050 }) => {
  return (
    <>
      <div
        className="relative flex justify-center items-center animate-scaleUp delay-500 mt-8 md:mt-0"
        style={{ display: isScreen1050 ? "none" : "" }}
      >
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] bg-blue-400 rounded-full"
          style={{ animation: "textScaleUp 0.7s ease-out 0.3s forwards" }}
        ></span>

        <img
          src={header_bg}
          alt="header"
          className="w-full max-w-[300px] sm:max-w-[450px] md:max-w-[555px]"
          style={{ animation: "scaleUp 0.7s ease-out 0.3s forwards" }}
        />

        {/* Image Content 1 */}
        <div
          className="absolute top-1/2 left-1/2 flex items-center gap-2 p-2 bg-white rounded-md shadow-lg transform -translate-x-[calc(50%+6rem)] -translate-y-[calc(50%+6rem)]
            sm:gap-4 sm:p-4 sm:-translate-x-[calc(50%+8rem)] sm:-translate-y-[calc(50%+8rem)]
            max-w-[280px] sm:max-w-none" /* Limit width on smaller screens */
          style={{
            animation: "slideInFromLeft 1s ease-out forwards",
            opacity: 0,
          }}
        >
          <span
            className="p-1 text-lg bg-blue-100 text-blue-400 rounded-full
                  sm:p-3 sm:text-2xl"
          >
            <PiBagSimpleFill />
          </span>
          <div className="text-left">
            <h4 className="text-base font-semibold text-gray-800 sm:text-xl">
              10000+
            </h4>
            <p className="text-xs text-gray-500 sm:text-base">Active Jobs</p>
          </div>
        </div>

        {/* Image Content 2 */}
        <div
          className="absolute top-1/2 left-1/2 flex flex-col gap-2 bg-white p-2 rounded-md shadow-lg transform translate-x-[calc(50%-1rem)] translate-y-[calc(80%-0rem)]
              sm:gap-4 sm:p-4 sm:translate-x-[calc(50%-2rem)] sm:translate-y-[calc(100%-0rem)] max-w-[280px]"
          style={{
            animation: "slideInFromRight 1s ease-out forwards",
            opacity: 0,
          }}
        >
          <ul className="space-y-1 text-gray-500 text-xs sm:space-y-2 sm:text-base">
            <li className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-2xl text-orange-500">
                <TbCheckbox />
              </span>
              Tailored AI-based Search across candidates
            </li>
            <li className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-2xl text-orange-500">
                <TbCheckbox />
              </span>
              Expert AI Interviewer
            </li>
          </ul>
        </div>

        <style>
          {`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-350px) translateY(-200px);
          }
          100% {
            opacity: 1;
            transform: translateX(-300px) translateY(-200px);
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInFromLeft {
            0% {
              opacity: 0;
              transform: translateX(0px) translateY(-100px);
            }
            100% {
              opacity: 1;
              transform: translateX(-200px) translateY(-100px);
            }
          }
        }

        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(100px) translateY(120px);
          }
          100% {
            opacity: 1;
            transform: translateX(50px) translateY(120px);
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInFromRight {
            0% {
              opacity: 0;
              transform: translateX(100px) translateY(70px);
            }
            100% {
              opacity: 1;
              transform: translateX(50px) translateY(70px);
            }
          }
        }

        @keyframes scaleUp {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textScaleUp {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}
        </style>
      </div>
    </>
  );
};

const BodySection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="max-w-8xl mx-auto p-6 sm:p-10 md:p-16 lg:p-20"
      style={{ overflowX: "hidden" }}
    >
      {/* Section 1 */}
      <div className="flex flex-col md:flex-row gap-12">
        <motion.div
          className="body-content text-left flex flex-col justify-center items-start order-1 md:order-1"
          style={{ overflowX: "hidden" }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl text-gray-800 font-bold mb-4">
            Your Partner in Smart Hiring
          </h2>
          <p className="text-gray-600 mb-8 leading-7 text-sm sm:text-base">
            Our platform ensures a seamless and efficient hiring process,
            creating equal opportunities and fostering a fair recruitment
            environment for all.
          </p>
          <button className="btn bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
            Post Job
          </button>
        </motion.div>

        <motion.div
          className="body-image order-2 md:order-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ overflowX: "hidden" }}
        >
          <img
            src={CandidatePng}
            alt="Smart Hiring Illustration"
            className="mx-auto"
            style={{ width: "1200px", height: "auto" }}
          />
        </motion.div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col md:flex-row gap-12 mt-12">
        <motion.div
          className="body-image order-2 md:order-1"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ overflowX: "hidden" }}
        >
          <img
            src={RecruiterPng}
            alt="Job Hunt Simplified"
            className="mx-auto"
            style={{ width: "1200px", height: "auto" }} // Set width to 250px and height to auto
          />
        </motion.div>

        <motion.div
          className="body-content text-left flex flex-col justify-center items-start order-1 md:order-2"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ overflowX: "hidden" }}
        >
          <h2 className="text-3xl sm:text-4xl text-gray-800 font-bold mb-4">
            Your Job Hunt Simplified
          </h2>
          <p className="text-gray-600 mb-8 leading-7 text-sm sm:text-base">
            As a job seeker, you deserve a platform that understands your needs.
            At Ruthi, we provide the resources and support to help you navigate
            the job market and land your dream job with confidence.
          </p>
          <div className="flex gap-4 justify-start">
            <button
              className="border border-orange-500 hover:border-orange-600 text-orange-500 hover:text-white hover:bg-orange-600 py-2 px-4 rounded bg-transparent text-sm"
              onClick={() => {
                navigate("/reach-out");
              }}
            >
              Refer a Friend
            </button>

            <button
              className="btn bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded text-sm"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Register Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const [isScreen450, setIsScreen450] = useState(false);
  const [email, setEmail] = useState("");

  const isValidEmail = (email) => {
    // Basic email pattern for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubscribe = async () => {
    try {
      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const response = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      setEmail("");
    } catch (error) {
      toast.error("Subscription failed. Please try again later.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);

      if (window.innerWidth < 450) {
        setIsScreen450(true);
      } else {
        setIsScreen450(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.footer
      className={`w-full mx-auto text-black ${
        isScreen450 ? "p-5" : "p-20"
      } relative overflow-hidden`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      // style={{ backgroundColor: "#57abff" }}
    >
      {/* <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: "linear-gradient(to bottom, #ff8c00, transparent)",
        }}
      ></div> */}
      <div className="flex flex-wrap justify-around items-start pt-8">
        {/* Logo and Description */}
        <div
          className={` ${
            isScreen450
              ? "flex flex-col items-center justify-center mb-10"
              : "flex-1 min-w-[200px] text-left mb-5 pr-5"
          }  `}
        >
          <img
            src={Ruthi_full_Logo}
            alt="Ruthi Logo"
            className="w-24 sm:w-36 h-auto cursor-pointer mb-5"
            onClick={() => {
              navigate("/");
            }}
          />
          <p className={`${isScreen450 ? "text-center" : "text-left"}`}>
            Your partner in smart hiring. Discover opportunities, empower
            hiring, and grow with confidence.
          </p>
        </div>

        {/* Subscribe Section */}
        <div className="flex-1 min-w-[200px] text-center mb-5">
          <h2
            className={`text-[#03045e] text-3xl font-bold ${
              isScreen450 ? "mb-6" : "mb-12"
            } animate-bounce`}
            style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)" }}
          >
            Stay Updated
          </h2>
          <p className="text-black mb-2">
            Subscribe to receive the latest job postings and updates directly to
            your inbox.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md border-none w-52"
              style={{ color: "#111827" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-[#ff8800] text-white py-2 px-4 rounded-md transition duration-300 hover:bg-[#d77a00]"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex-1 min-w-[200px] text-center mb-5">
          <h3 className="text-lg text-black mb-2">Follow Us</h3>
          <div className="flex gap-4 justify-center mt-2">
            <a
              href="#"
              className="text-black transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="#"
              className="text-black transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-black transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-black transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaLinkedinIn size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-black text-sm border-t border-opacity-20 pt-4">
        <p>&copy; {new Date().getFullYear()} Ruthi. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

// Main Component
const RuthiLandingPage = () => (
  <div className="w-full mx-auto min-h-screen flex flex-col overlow-x-hidden">
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },
      }}
    />
    <div className="bg-[#e0ebfd]">
      <Nav />
      <Header />
    </div>
    <BodySection />
    <div className="bg-[#e0ebfd]">
      <Footer />
    </div>
  </div>
);

export default RuthiLandingPage;
