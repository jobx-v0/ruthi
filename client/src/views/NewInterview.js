import React, { useState, useEffect, useRef } from "react";
import {
  fetchQuestionsAPI,
  createInterviewAPI,
  submitInterviewAPI,
} from "../api/interviewApi";
import QuestionDisplay from "../components/interview/QuestionDisplay";
import QuestionCategoryModal from "../components/interview/QuestionTypeModal";
import SubmitIntervieModal from "../components/interview/SubmitInterviewModal";
import Nav from "../components/core/Nav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Flex } from "@tremor/react";
import { Chip, Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../components/interview/interview.css";
import VideoRecorder from "../components/VideoRecorder";
import { useLocation } from "react-router-dom";
import CheatingInterviewModal from "../components/interview/CheatingInterviewModal";

const InterviewPage = () => {
  var { authToken, setToken, userInfo, fetchUserInfo } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const hasFetchedQuestions = useRef(false);
  const hasCreatedInterview = useRef(false);
  const navigate = useNavigate();
  const [isQuestionPrevMoved, setQuestionPrevMoved] = useState(false);
  const {
    isOpen: isSubmitModalOpen,
    onOpen: onOpenSubmitModal,
    onClose: onCloseSubmitModal,
  } = useDisclosure();
  const [isTimerActive, setIsTimerActive] = useState(true);
  const location = useLocation();
  const { jobId } = location.state || {};

  const [isFullScreen, setIsFullScreen] = useState(true);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isCheatingModalOpen, setIsCheatingModalOpen] = useState(false);

  const handleTimerActiveChange = (newTimerActiveValue) => {
    setIsTimerActive(newTimerActiveValue);
  };

  const fetchQuestionsData = (token) => {
    fetchQuestionsAPI(token, jobId)
      .then((response) => {
        const questionsResponse = response?.data;
        setQuestions(questionsResponse);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        navigate("/login");
      });
  };

  useEffect(() => {
    const storedAuthToken = localStorage.getItem("authToken");
    if (storedAuthToken) {
      setToken(storedAuthToken);
      fetchUserInfo(storedAuthToken);

      if (!hasFetchedQuestions.current) {
        hasFetchedQuestions.current = true;
        fetchQuestionsData(storedAuthToken);
      }
    } else {
      navigate("/login");
      return;
    }
  }, [jobId]);

  useEffect(() => {
    if (
      authToken &&
      userInfo?._id &&
      jobId &&
      questions?.length > 0 &&
      !hasCreatedInterview?.current
    ) {
      hasCreatedInterview.current = true;
      let questionIds = questions?.map((question) => question?._id);
      createInterviewAPI(authToken, userInfo?._id, jobId, questionIds).catch(
        (error) => {
          console.error("Error creating interview:", error);
        }
      );
    }
  }, [authToken, userInfo?._id, jobId, questions?.length]);

  const enterFullScreen = (attempt = 1) => {
    const elem = document.documentElement;

    if (document.fullscreenEnabled) {
      const requestFullScreen =
        elem.requestFullscreen ||
        elem.mozRequestFullScreen ||
        elem.webkitRequestFullscreen ||
        elem.msRequestFullscreen;

      if (requestFullScreen) {
        requestFullScreen
          .call(elem)
          .then(() => {
            setIsFullScreen(true);
          })
          .catch((err) => {
            console.warn("Error entering fullscreen:", err);
            if (attempt < 5) {
              setTimeout(() => {
                enterFullScreen(attempt + 1);
              }, 1000);
            }
          });
      }
    } else {
      console.log("Fullscreen is not supported by this browser.");
    }
  };

  const onCloseCheatingModal = () => {
    setIsCheatingModalOpen(false);
    exitFullScreen();
    navigate("/thank-you");
  };

  useEffect(() => {
    const handleFocusChange = () => {
      if (!document.hasFocus()) {
        setTabSwitchCount((prev) => prev + 1);

        if (tabSwitchCount > 2) {
          setIsCheatingModalOpen(true);
          setTimeout(() => {
            onCloseCheatingModal();
          }, 8000);
        }

        toast(
          `Warning: Tab switching or window change detected! ${tabSwitchCount}`,
          {
            icon: "⚠️",
          }
        );
      }
    };

    window.addEventListener("focus", handleFocusChange);
    window.addEventListener("blur", handleFocusChange);

    return () => {
      window.removeEventListener("focus", handleFocusChange);
      window.removeEventListener("blur", handleFocusChange);
    };
  }, [tabSwitchCount]);

  const handleKeyDown = (e) => {
    e.preventDefault();
    toast("Warning: Keyboard usage is not allowed!", {
      icon: "⚠️",
    });
    console.log("Warning: Keyboard usage is not allowed!");
  };

  const ensureFullScreen = () => {
    if (!document.fullscreenElement && isFullScreen) {
      enterFullScreen();
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      const exitFullScreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      if (exitFullScreen) {
        exitFullScreen
          .call(document)
          .then(() => {
            setIsFullScreen(false);
          })
          .catch((err) => {
            console.warn("Error exiting fullscreen:", err);
          });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    document.addEventListener("fullscreenchange", ensureFullScreen);

    const intervalId = setInterval(() => {
      if (isFullScreen && !document.fullscreenElement) {
        enterFullScreen();
      }
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", ensureFullScreen);
      clearInterval(intervalId);
    };
  }, [isFullScreen]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionPrevMoved(false);
    }
  };

  const handleSubmit = () => {
    submitInterviewAPI(authToken, userInfo._id, jobId)
      .then((response) => {
        exitFullScreen();
        navigate("/thank-you");
      })
      .catch((error) => {
        console.error("Error submitting interview:", error);
      });
  };

  const questionsCount = questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === questionsCount - 1;

  return (
    <div className="flex flex-col items-center justify-center">
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
      <Nav
        isInterviewPage={true}
        isLandingPage={false}
        exitFullScreen={exitFullScreen}
      />
      <div className="bg-white m-3 p-2 lg:p-4 rounded-xl shadow-xl border-1 border-slate-50 max-w-6xl w-11/12  lg:w-full flex flex-col ">
        <Flex className="gap-4 p-0 py-1 mb-3 w-full justify-between">
          {" "}
          <div>
            <Chip
              variant="shadow"
              classNames={{
                base: "border-gray/50 border-1 rounded-lg bg-white shadow-slate-200/30",
                content: "text-slate-500 font-normal py-1 text-xs lg:text-sm",
              }}
            >
              {" "}
              Question{" "}
              <span style={{ letterSpacing: "1.6px" }}>
                {currentQuestionIndex + 1}/{questionsCount}
              </span>
            </Chip>
          </div>
          <div>
            {/* <QuestionCategoryModal
              type={
                questions.length !== 0
                  ? questions[currentQuestionIndex]
                    ? questions[currentQuestionIndex].type
                    : ""
                  : ""
              }
            /> */}
            <QuestionCategoryModal
              type={
                questions && questions.length !== 0
                  ? questions[currentQuestionIndex]?.type || ""
                  : ""
              }
            />
          </div>
        </Flex>

        <QuestionDisplay
          question={
            questions[currentQuestionIndex]
              ? questions[currentQuestionIndex].question
              : ""
          }
          skipAnimate={isQuestionPrevMoved}
          currentQuestionIndex={currentQuestionIndex}
        />

        <VideoRecorder
          questionId={
            questions[currentQuestionIndex] &&
            questions[currentQuestionIndex]._id
              ? questions[currentQuestionIndex]._id
              : ""
          }
          jobId={jobId}
          onTimerActiveChange={handleTimerActiveChange}
          userId={userInfo?._id}
        />

        {!isTimerActive ? (
          <Flex className="gap-4 p-0 py-1 mt-3 w-full justify-end">
            <div>
              <Tooltip
                showArrow={true}
                content={isLastQuestion ? "Submit Interview" : "Next Question"}
                placement="bottom"
              >
                <Button
                  size="sm"
                  className=" py-6 lg:p-8 text-md w-0 lg:w-auto lg:text-lg font-medium border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-1"
                  onPress={
                    isLastQuestion ? onOpenSubmitModal() : handleNextQuestion()
                  }
                >
                  {isLastQuestion ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} size="lg" />
                    </>
                  ) : (
                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </Flex>
        ) : (
          <></>
        )}
        <CheatingInterviewModal
          isCheatingModalOpen={isCheatingModalOpen}
          onCloseCheatingModal={onCloseCheatingModal}
        />
        <SubmitIntervieModal
          isSubmitModalOpen={isSubmitModalOpen}
          onOpenSubmitModal={onOpenSubmitModal}
          onCloseSubmitModal={onCloseSubmitModal}
          handleSubmit={handleSubmit}
        />
      </div>
      <footer className="text-center text-gray-500 text-xs mt-4">
        <p>&copy; 2024 Job-X</p>
      </footer>
    </div>
  );
};

export default InterviewPage;
