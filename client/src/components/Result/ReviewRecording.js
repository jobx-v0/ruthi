import React, { useEffect, useState } from "react";
import Nav from "../core/Nav";
import { fetchResult } from "../../api/result";
import { useAuth } from "../../context/AuthContext";
import DownloadPdf from "../../services/DownloadPdf";
import ViewWebmVideo from "../../services/ViewWebmVideo";

const ReviewRecording = () => {
  const { authToken } = useAuth();
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Track active question

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Handler to set the active question
  const handleQuestionClick = (index) => {
    setActiveQuestionIndex(index);
  };

  const displayedText = showMore
    ? resultData?.final_review
    : resultData?.final_review?.slice(0, 100) +
      (resultData?.final_review?.length > 100 ? "..." : "");

  const fetchResultData = async () => {
    const jobId = "66f65a32020744c01dd2d902";
    const res = await fetchResult(authToken, jobId);
    setResultData(res);
    setIsLoading(false); // Stop loading when data is fetched
  };

  useEffect(() => {
    fetchResultData();
  }, []);

  return (
    <>
      <Nav />
      <div className="p-6 bg-gray-100 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-4 shadow-lg">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="bg-gray-300 h-6 w-3/4 mb-4 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-1/2 mb-2 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-1/2 mb-2 rounded-lg"></div>
              <div className="bg-gray-300 h-6 w-1/3 mt-4 rounded-lg"></div>
              <div className="bg-gray-300 h-12 w-full mt-6 rounded-lg"></div>
            </div>
          ) : (
            <>
              <div className="bg-orange-100 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold">{resultData?.username}</h2>
                <p className="text-sm text-gray-600">{resultData?.userEmail}</p>
                <div className="mt-4">
                  <p className="font-semibold">Screened for</p>
                  <p className="text-gray-800">{resultData?.jobTitle}</p>
                  {/* <p className="text-sm text-gray-600">
                    Years of experience: 5.00 yrs
                  </p> */}
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Skills:</span>{" "}
                    {resultData?.jobSkills?.join(", ")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Score:</span>{" "}
                    {resultData?.total_score?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Trust Score:</span>{" "}
                    {resultData?.final_trust_score?.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">
                        Scores in Each Category:
                      </span>
                    </p>
                    {resultData?.total_score_in_each_category &&
                      Object.entries(
                        resultData.total_score_in_each_category
                      ).map(([category, score]) => (
                        <p key={category}>
                          <span className="font-semibold">
                            {category
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          : {score.toFixed(1)}
                        </p>
                      ))}
                  </div>

                  <p>
                    <span className="font-semibold">Review:</span>{" "}
                    {displayedText}{" "}
                    {resultData?.final_review?.length > 100 && (
                      <button
                        className="text-blue-500"
                        onClick={toggleShowMore}
                      >
                        {showMore ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
              <DownloadPdf interviewId={resultData?.interview_id} />

              <div className="mt-6">
                <h3 className="font-bold text-lg">Recorded responses:</h3>
                <ul className="mt-4 space-y-4">
                  {/* List of questions as buttons */}
                  {resultData?.interviewData?.map((item, index) => (
                    <li key={item._id} className="flex items-center space-x-2">
                      <button
                        className={`w-full text-left py-2 px-4 rounded-lg ${
                          index === activeQuestionIndex
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 hover:bg-orange-100"
                        } `}
                        onClick={() => handleQuestionClick(index)}
                      >
                        <span className="font-semibold">{index + 1}. </span>
                        <span>
                          {item?.question?.slice(0, 45)}
                          {item?.question?.length > 45 && "..."}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-white p-6 ml-6 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="bg-gray-300 h-6 w-1/2 mb-4 rounded-lg"></div>
              <div className="bg-gray-300 h-6 w-1/3 mb-4 rounded-lg"></div>
              <div className="bg-gray-300 h-60 w-full mb-6 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-5/6 mb-2 rounded-lg"></div>
              <div className="bg-gray-300 h-4 w-full mb-2 rounded-lg"></div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">
                {resultData?.interviewData[activeQuestionIndex]?.question}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Breakdown of Scores:</h3>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <span className="font-semibold">
                      Communication Skills:{" "}
                    </span>
                    {
                      resultData?.interviewData[activeQuestionIndex]?.scores
                        ?.communication_skills
                    }
                    /5
                  </li>
                  <li>
                    <span className="font-semibold">Subject Expertise: </span>
                    {
                      resultData?.interviewData[activeQuestionIndex]?.scores
                        ?.subject_expertise
                    }
                    /5
                  </li>
                  <li>
                    <span className="font-semibold">Relevancy: </span>
                    {
                      resultData?.interviewData[activeQuestionIndex]?.scores
                        ?.relevancy
                    }
                    /5
                  </li>
                </ul>
                <p className="mt-4">
                  <b>Feedback:</b>{" "}
                  {resultData?.interviewData[activeQuestionIndex]?.feedback}
                </p>
                <p className="mt-4">
                  <b>Review:</b>{" "}
                  {resultData?.interviewData[activeQuestionIndex]?.review}
                </p>
              </div>
              <div className="bg-gray-200 aspect-video rounded-lg mb-6">
                <ViewWebmVideo
                  interviewId={resultData?.interview_id}
                  questionId={
                    resultData?.interviewData[activeQuestionIndex]?._id
                  }
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Answer (Transcript):</h3>
                <p className="mt-2 text-gray-800">
                  {resultData?.interviewData[activeQuestionIndex]?.answer}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewRecording;
