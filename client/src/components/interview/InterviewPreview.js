import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const InterviewPreview = ({ profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedMic, setSelectedMic] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [micLevel, setMicLevel] = useState(0);
  const [capturedPic, setCapturedPic] = useState(profilePic);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = location.state || {};

  useEffect(() => {
    if (jobId) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioInputDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const audioOutputDevices = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        setCameras(videoDevices);
        setMicrophones(audioInputDevices);
        setSpeakers(audioOutputDevices);

        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      });
    } else {
      navigate("/jobs");
    }
  }, []);

  const startCamera = () => {
    if (selectedCamera) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          },
          audio: { deviceId: selectedMic ? { exact: selectedMic } : undefined },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          videoRef.current.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    } else {
      console.error("No camera selected");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    // Set the canvas size to match the 1:1 ratio of the video
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to be square based on video width (assuming 1:1 ratio)
    const size = video.videoWidth; // Use video width or height (since it's 1:1, they are equal)
    canvas.width = size;
    canvas.height = size;

    // Draw video frame onto the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, size, size);

    // Capture the photo as a data URL or any format you need
    const capturedImage = canvas.toDataURL("image/png");

    // Do something with the captured image (e.g., save it or display it)
    setCapturedPic(capturedImage);
    setShowModal(false); // Close modal after capturing
  };

  const testSpeaker = () => {
    const audio = new Audio("/test-speaker.mp3");

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationFrameId;

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedVolume = Math.min(volume / 256, 1);
      setMicLevel(normalizedVolume * 100);

      animationFrameId = requestAnimationFrame(updateLevel);
    };

    if (selectedSpeaker && audio.setSinkId) {
      audio
        .setSinkId(selectedSpeaker)
        .then(() => {
          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });

          updateLevel();
        })
        .catch((err) => {
          console.error("Error setting speaker output:", err);
        });
    } else {
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });

      updateLevel();
    }

    audio.onended = () => {
      cancelAnimationFrame(animationFrameId);
      setMicLevel(0);
      audioContext.close();
    };
  };

  const testMicrophone = () => {
    if (!selectedMic) {
      toast("Warning: Please select a microphone!", {
        icon: "⚠️",
      });
      return;
    }

    const constraints = {
      audio: {
        deviceId: { exact: selectedMic },
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 512;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let animationFrameId;

      const updateMicLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const normalizedVolume = Math.min(volume / 256, 1);
        setMicLevel(normalizedVolume * 100);

        animationFrameId = requestAnimationFrame(updateMicLevel);
      };

      updateMicLevel();

      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();

        cancelAnimationFrame(animationFrameId);

        setMicLevel(0);

        audio.play().catch((error) => {
          console.error("Error playing audio: ", error);
        });
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    });
  };

  const handleContinue = () => {
    if (capturedPic) {
      navigate("/new-interview", { state: { jobId: jobId } });
    } else {
      toast("Warning: Please add a photo before continuing.", {
        icon: "⚠️",
      });
    }
  };

  const MicLevelBoxes = ({ micLevel }) => {
    const numBoxes = 10;

    const filledBoxes = Math.round((micLevel / 100) * numBoxes);

    return (
      <div className="mt-4 flex space-x-1">
        {Array.from({ length: numBoxes }).map((_, index) => (
          <div
            key={index}
            className={`w-12 h-4 border-2 ${
              index < filledBoxes ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex justify-center items-center">
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
      <div className="max-w-4xl p-6 flex items-start">
        {/* Profile Section */}
        <div
          className="flex flex-col items-center justify-center mr-8"
          style={{ height: "430px", width: "400px" }}
        >
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 mb-4">
            <img
              src={capturedPic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="object-cover w-full h-full" // Ensure image covers the container in 1:1 ratio
            />
          </div>

          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (selectedCamera) {
                setShowModal(true);
                startCamera();
              } else {
                toast("Warning: Please select a camera!", {
                  icon: "⚠️",
                });
              }
            }}
          >
            Change Photo
          </button>
        </div>

        {/* Device Settings Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-center">
            Device Settings
          </h2>

          <div className="mt-4">
            <label className="block text-lg">Select Camera:</label>
            <select
              onChange={(e) => setSelectedCamera(e.target.value)}
              value={selectedCamera}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {cameras.map((camera, index) => (
                <option key={index} value={camera.deviceId}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-lg">Select Microphone:</label>
            <select
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {microphones.map((mic, index) => (
                <option key={index} value={mic.deviceId}>
                  {mic.label || `Microphone ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-lg">Select Speaker:</label>
            <select
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {speakers.map((speaker, index) => (
                <option key={index} value={speaker.deviceId}>
                  {speaker.label || `Speaker ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={testSpeaker}
            >
              Test Speaker
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={testMicrophone}
            >
              Test Microphone
            </button>
          </div>

          <MicLevelBoxes micLevel={micLevel} />

          <button
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded w-full"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
              Capture Photo
            </h2>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-64 h-64 mb-4 rounded border" // Video in 1:1 ratio
            />
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  stopCamera();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={capturePhoto}
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPreview;
