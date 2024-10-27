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

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);

      if (window.innerWidth < 450) {
        setMargin({ marginTop: "150px", marginBottom: "150px" });
      } else {
        setMargin({ marginTop: "0px", marginBottom: "0px" });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="flex flex-col md:grid md:grid-cols-2 md:gap-8 items-center w-full max-w-6xl mx-auto p-4">
      <div
        className="space-y-6 text-center md:text-left"
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
          onClick={() => navigate("/login")}
        >
          START NOW
        </button>
      </div>
      <HeaderImage />
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
const HeaderImage = () => (
  <div className="relative flex justify-center items-center animate-scaleUp delay-500 mt-8 md:mt-0">
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
          Get 20% off on every 1st month
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
);

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
  return (
    <motion.footer
      className="w-full mx-auto text-white bg-[#1e90ff] p-20 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ backgroundColor: "#1e90ff" }} // Primary Blue
    >
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: "linear-gradient(to bottom, #ff8c00, transparent)",
        }}
      ></div>
      <div className="flex flex-wrap justify-around items-center pt-8">
        {/* Logo and Description */}
        <div className="flex-1 min-w-[200px] text-left mb-5">
          <img
            src={Ruthi_full_Logo}
            alt="Ruthi Logo"
            className="w-24 sm:w-36 h-auto cursor-pointer mb-5"
            onClick={() => {
              navigate("/");
            }}
          />
          <p className="text-white">
            Your partner in smart hiring. Discover opportunities, empower
            hiring, and grow with confidence.
          </p>
        </div>

        {/* Subscribe Section */}
        <div className="flex-1 min-w-[200px] text-center mb-5">
          <h2
            className="text-[#ff8c00] text-3xl font-bold mb-12 animate-bounce"
            style={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)" }}
          >
            Stay Updated
          </h2>
          <p className="text-white mb-2">
            Subscribe to receive the latest job postings and updates directly to
            your inbox.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md border-none w-52"
              style={{ color: "#111827" }}
            />
            <button className="bg-[#ff8800] text-white py-2 px-4 rounded-md transition duration-300 hover:bg-[#d77a00]">
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex-1 min-w-[200px] text-center mb-5">
          <h3 className="text-lg text-white mb-2">Follow Us</h3>
          <div className="flex gap-4 justify-center mt-2">
            <a
              href="#"
              className="text-white transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="#"
              className="text-white transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-white transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-white transition duration-300 hover:text-[#ff8c00] transform hover:scale-110"
            >
              <FaLinkedinIn size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-white text-sm border-t border-opacity-20 pt-4">
        <p>&copy; {new Date().getFullYear()} Ruthi. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

// Main Component
const RuthiLandingPage = () => (
  <div className="w-full mx-auto min-h-screen flex flex-col overlow-x-hidden">
    <Nav />
    <Header />
    <BodySection />
    <Footer />
  </div>
);

export default RuthiLandingPage;
