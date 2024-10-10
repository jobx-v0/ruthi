import { useRef, useState, useEffect } from "react";
import { getSasURL, uploadChunkToAzureAPI } from "../api/azureApi";
import { useAuth } from "../context/AuthContext";
import { saveChunksLengthAPI } from "../api/interviewApi";

const CHUNK_SIZE = 5 * 1024 * 1024;

const VideoRecorder = ({ questionId, jobId, userId, onTimerActiveChange }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(30);
  const [recordingTime, setRecordingTime] = useState(150);
  const [timerActive, setTimerActive] = useState(true);
  const [showRecordingIcon, setShowRecordingIcon] = useState(false);

  const [stream, setStream] = useState(null);
  const videoChunks = useRef([]);
  const accumulatedChunks = useRef([]);
  const chunkSizeRef = useRef(0);
  const chunkNumberRef = useRef(1);

  const [showCaptureButtons, setShowCaptureButtons] = useState(true);
  const [showTimer, setShowTimer] = useState(true);

  const { authToken } = useAuth();

  useEffect(() => {
    onTimerActiveChange(timerActive);
  }, [timerActive, onTimerActiveChange]);

  useEffect(() => {
    setCapturing(false);
    setThinkingTime(30);
    setRecordingTime(150);
    setTimerActive(true);
    setShowRecordingIcon(false);
    setShowTimer(true);
    setShowCaptureButtons(true);
  }, [questionId]);

  const getUserMedia = (constraints) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    const getUserMediaFallback =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (getUserMediaFallback) {
      return new Promise((resolve, reject) =>
        getUserMediaFallback.call(navigator, constraints, resolve, reject)
      );
    }

    return Promise.reject(
      new Error("Your browser does not support media recording.")
    );
  };

  const uploadChunkToAzure = async (blob, chunkNumber) => {
    try {
      const response = await getSasURL(
        authToken,
        userId,
        jobId,
        questionId,
        chunkNumber
      );
      const sasUrl = response.data.sasUrl;

      await uploadChunkToAzureAPI(sasUrl, blob);
    } catch (error) {
      console.error("Error uploading chunk:", error);
    }
  };

  const saveChunksLength = async (length) => {
    try {
      saveChunksLengthAPI(authToken, userId, jobId, questionId, length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      setRecordingTime(0);
      setShowRecordingIcon(false);
      setTimerActive(false);
      setShowTimer(false);
      setShowCaptureButtons(false);
      saveChunksLength(chunkNumberRef.current);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleStartCaptureClick = () => {
    setCapturing(true);
    setThinkingTime(0);
    setShowRecordingIcon(true);
    getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        if (window.MediaRecorder) {
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm",
          });
          mediaRecorderRef.current = mediaRecorder;
          videoChunks.current = [];
          accumulatedChunks.current = [];
          chunkSizeRef.current = 0;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              accumulatedChunks.current.push(event.data);
              chunkSizeRef.current += event.data.size;

              if (chunkSizeRef.current >= CHUNK_SIZE) {
                const chunkBlob = new Blob(accumulatedChunks.current, {
                  type: "video/webm",
                });

                uploadChunkToAzure(chunkBlob, chunkNumberRef.current);

                chunkNumberRef.current += 1;

                accumulatedChunks.current = [];
                chunkSizeRef.current = 0;
              }

              videoChunks.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            if (chunkSizeRef.current > 0) {
              const remainingChunkBlob = new Blob(accumulatedChunks.current, {
                type: "video/webm",
              });

              uploadChunkToAzure(remainingChunkBlob, chunkNumberRef.current);

              videoChunks.current = [];
              accumulatedChunks.current = [];
              chunkSizeRef.current = 0;
              chunkNumberRef.current = 1;
              setRecordingTime(150);
              setThinkingTime(30);
            }
          };

          mediaRecorder.start(1000);
        }
      })
      .catch((error) => {
        alert("Unable to access media devices: " + error.message);
      });
  };

  useEffect(() => {
    let interval;

    if (timerActive) {
      if (thinkingTime > 0) {
        interval = setInterval(() => {
          setThinkingTime((prev) => prev - 1);
        }, 1000);
      } else if (recordingTime > 0 && capturing) {
        interval = setInterval(() => {
          setRecordingTime((prev) => prev - 1);
        }, 1000);
      }

      if (thinkingTime === 0 && !capturing) {
        handleStartCaptureClick();
      }

      if (recordingTime === 0 && capturing) {
        handleStopCaptureClick();
      }
    }

    return () => clearInterval(interval);
  }, [
    thinkingTime,
    recordingTime,
    timerActive,
    capturing,
    handleStartCaptureClick,
    handleStopCaptureClick,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="w-[100%] h-full mb-4 relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full rounded-lg shadow-lg border-10 border-gray-300 "
        />
        {showRecordingIcon && (
          <div className="absolute top-0 left-0 m-2 p-2 bg-red-600 text-white rounded-full">
            Recording...
          </div>
        )}
        <div className="absolute bottom-0 left-0 m-2 p-2 bg-white text-black rounded-lg">
          {showTimer
            ? thinkingTime > 0 && !capturing
              ? `Recording will start in ${thinkingTime} seconds`
              : recordingTime > 0 &&
                `Recording will stop in ${recordingTime} seconds`
            : null}
        </div>
      </div>

      <div className="flex space-x-4">
        {showCaptureButtons && thinkingTime > 0 && !capturing && (
          <button
            onClick={handleStartCaptureClick}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Start Capture
          </button>
        )}
        {showCaptureButtons && recordingTime > 0 && capturing && (
          <button
            onClick={handleStopCaptureClick}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Stop Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
