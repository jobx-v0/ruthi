import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import { AuthProvider } from "./context/AuthContext";
import SignupPage from "./views/Signup";
import AdminPage from "./views/Admin";
import Login from "./views/Login";
import ThankYouPage from "./views/ThankYouPage";
import { NextUIProvider } from "@nextui-org/react";
import Jobs from "./views/Jobs";
import NewInterview from "./views/NewInterview";
import LandingTest from "./components/LandingTest";
import VerificationPage from "./views/Verification";
import VerifyEmailPrompt from "./views/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import SideBar from "./views/SideBar";
import UploadResume from "./views/UploadResume";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { ToastContainer } from "react-toastify";
import ReachOut from "./components/ReachOut";
import JobCard from "./components/core/JobCards";
import Candidates from "./components/core/Candidates";
import JobDescription from "./components/core/JobDescription";
import RecruiterDashboard from "./components/core/RecruiterComponents/RecruiterDashboard";
import "react-toastify/dist/ReactToastify.css";
import CandidatesApplied from "./components/RecruiterDashboard/CandidatesApplied";
import AddNewJob from "./components/core/AddNewJob";
import EditJob from "./components/core/EditJobModel";
import ChatBotUI from "./components/chatbot/ChatBotUI";
import InterviewTokenVerifier from "./components/interview/InterviewTokenVerifier";
import InterviewPreview from "./components/interview/InterviewPreview";

function App() {
  return (
    <AuthProvider>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest Routes (non-authenticated pages) */}
            <Route
              path="/"
              element={
                <GuestRoute>
                  <LandingTest />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/ForgetPassword"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />

            <Route
              path="/reach-out"
              element={
                // <GuestRoute>
                <ReachOut />
                // </GuestRoute>
              }
            />

            {/* Protected Routes (authenticated pages) */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatBotUI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-interview"
              element={
                <ProtectedRoute>
                  <NewInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-preview"
              element={
                <ProtectedRoute>
                  <InterviewPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-interview/:token"
              element={
                <ProtectedRoute>
                  <InterviewTokenVerifier />
                </ProtectedRoute>
              }
            />
            <Route
              path="/thank-you"
              element={
                <ProtectedRoute>
                  <ThankYouPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <SideBar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/uploadResume"
              element={
                <ProtectedRoute>
                  <UploadResume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/JobCards"
              element={
                <ProtectedRoute>
                  <JobCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Candidates"
              element={
                <ProtectedRoute>
                  <Candidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/JobDescription/:id"
              element={
                <ProtectedRoute>
                  <JobDescription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddNewJob"
              element={
                <ProtectedRoute>
                  <AddNewJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute>
                  <EditJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/job-portal"
              element={
                <ProtectedRoute>
                  <CandidatesApplied />
                </ProtectedRoute>
              }
            />

            {/* Routes not requiring protection */}
            {/* <Route path="/test" element={<VideoRecorder />} /> */}
            <Route path="/verification" element={<VerificationPage />} />
            <Route
              path="/verify-email-prompt"
              element={<VerifyEmailPrompt />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: "red",
              secondary: "black",
            },
          },
        }}
      />{" "}
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
