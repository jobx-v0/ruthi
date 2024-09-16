import React from "react";
import HeroSvg from "../assets/hero.svg";
import CandidateSvg from "../assets/candidate.svg";
import RecruiterSvg from "../assets/recruiter.svg";
import Ruthi_full_Logo from "../assets/Ruthi_full_Logo.png";

const RuthiLandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="bg-[#e0ebfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-row justify-between items-center py-4 sm:py-6">
            <h1 className="text-4xl font-bold text-blue-600">
              <img src={Ruthi_full_Logo} alt="Ruthi Logo" className="w-24 sm:w-36 h-auto hover:cursor-pointer" onClick={() => {
                window.location.href = "/";
              }}/>
            </h1>
            <div className="flex flex-row space-x-2 sm:space-x-4">
              <button className="px-2 sm:px-6 py-1 sm:py-3 text-xs sm:text-base text-[#FF4D00] border border-[#FF4D00] rounded-md font-semibold transition duration-300 ease-in-out hover:bg-orange-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50"
              onClick={() => {
                window.location.href = "/login";
              }}>
                Log in
              </button>
              <button className="px-2 sm:px-6 py-1 sm:py-3 text-xs sm:text-base bg-[#FF4D00] text-white rounded-md font-semibold transition duration-300 ease-in-out hover:bg-[#ef9d7f] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50" onClick={() => {
                window.location.href = "/signup";
              }}>
                Sign Up
              </button>
            </div>
          </header>

          <section className="flex flex-col lg:flex-row items-center justify-between py-12">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-5xl font-bold mb-6">Welcome To Ruthi</h2>
              <h3 className="text-3xl font-semibold mb-6 text-gray-700">
                Connecting Talent With Opportunity
              </h3>
              <p className="text-xl mb-8 leading-relaxed">
                At Ruthi, we bridge the gap between employers and job seekers with
                our innovative solutions. Whether you're looking to hire top
                talent or find your dream job, our platform provides a seamless,
                efficient, and fair hiring experience.
              </p>
              <button className="px-8 py-4 bg-[#FF4D00] text-white rounded-md text-xl font-semibold transition duration-300 ease-in-out hover:bg-[#ef9d7f] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50">
                START NOW
              </button>
            </div>
            <div className="lg:w-1/2 relative hidden lg:block">
              <img
                src={HeroSvg}
                alt="Happy job seeker"
                className=""
              />
            </div>
          </section>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-12">
          <section className="flex flex-col lg:flex-row items-center justify-between mb-24">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 order-last sm:order-first">
              <img
                src={RecruiterSvg}
                alt="Smart Hiring Illustration"
                className="w-full"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:pr-16 order-last lg:order-first">
              <h2 className="text-4xl font-bold mb-6">
                Your Partner in Smart Hiring
              </h2>
              <p className="text-xl mb-8 leading-relaxed">
                Our platform ensures a seamless and efficient hiring process,
                creating equal opportunities and fostering a fair recruitment
                environment for all.
              </p>
              <button className="px-8 py-4 bg-[#FF4D00] text-white rounded-md text-xl font-semibold transition duration-300 ease-in-out hover:bg-[#ef9d7f] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50">
                Post Job
              </button>
            </div>
          </section>

          <section className="flex flex-col-reverse lg:flex-row items-center justify-between">
            <div className="w-full lg:w-1/2 lg:pr-16">
              <h2 className="text-4xl font-bold mb-6">
                Your Job Hunt Simplified
              </h2>
              <p className="text-xl mb-8 leading-relaxed">
                As a job seeker, you deserve a platform that understands your
                needs. At Ruthi, we provide the resources and support to help you
                navigate the job market and land your dream job with confidence.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="px-8 py-4 border-2 border-[#FF4D00] text-[#FF4D00] rounded-md text-xl font-semibold transition duration-300 ease-in-out hover:bg-orange-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50">
                  Refer a Friend
                </button>
                <button className="px-8 py-4 bg-[#FF4D00] text-white rounded-md text-xl font-semibold transition duration-300 ease-in-out hover:bg-[#ef9d7f] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-50">
                  Register Now
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <img
                src={CandidateSvg}
                alt="Job Search Illustration"
                className="w-full"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RuthiLandingPage;