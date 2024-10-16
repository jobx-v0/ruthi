import React, { useState, useEffect, useRef } from "react";

const InterviewPreview = ({ profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedMic, setSelectedMic] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [capturedPic, setCapturedPic] = useState(profilePic);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
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
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const newPic = canvasRef.current.toDataURL("image/png");
    setCapturedPic(newPic);
    stopCamera();
    setShowModal(false);
    console.log("Updating backend with new profile photo", newPic);
  };

  const testSpeaker = () => {
    const audio = new Audio("/test-speaker.mp3");

    if (selectedSpeaker && audio.setSinkId) {
      audio
        .setSinkId(selectedSpeaker)
        .then(() => {
          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });
        })
        .catch((err) => {
          console.error("Error setting speaker output:", err);
        });
    } else {
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  const testMicrophone = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: selectedMic } })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);

          audio.play();
        };

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }, 3000);
      });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-y-4 items-center">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
            <img
              src={capturedPic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (selectedCamera) {
                setShowModal(true);
                startCamera();
              } else {
                alert("Please select a camera first.");
              }
            }}
          >
            Change Photo
          </button>
        </div>

        <div className="mt-6 w-full">
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
        </div>

        <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded">
          Continue
        </button>
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
              className="w-full h-64 mb-4 rounded border"
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
