import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownloadPdf from "../../services/DownloadPdf";

const ProfileCard = ({
  candidate,
  onClose,
  updateCandidateStage,
  StageStyling,
}) => {
  const [activeTab, setActiveTab] = useState("Hiring Stage");
  const [expandedStages, setExpandedStages] = useState({});
  const [hiringStages, setHiringStages] = useState([]);
  const [notes, setNotes] = useState([]); // Array to store notes
  const [newNote, setNewNote] = useState(""); // Input state for new note
  const [editIndex, setEditIndex] = useState(null); // Track index of note being edited
  const [Loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [profileStage, SetProfileStage] = useState(candidate.applicationStage);

  useEffect(() => {
    console.log("Candidate:", candidate); // Check the candidate object
    console.log("Candidate ID:", candidate?._id);
    console.log("hiring Stages from backend:", hiringStages);

    const fetchHiringStages = async () => {
      try {
        console.log("fetching from Backend Using useEffect()");
        const response = await fetch(
          `http://localhost:3001/api/${candidate._id}/stages`
        );
        const data = await response.json();
        console.log("Stages from backend:", data.stage);

        const result = Object.entries(data.stage).map(([key, value]) => {
          return { [key]: value };
        });
        console.log("result:", result);
        setHiringStages(result); // Update hiring stages state with fetched data
      } catch (error) {
        console.error("Error fetching hiring stages", error);
      }
    };

    if (candidate?._id) {
      fetchHiringStages();
    }
  }, [candidate]);

  useEffect(() => {
    const fetchallNotes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/${candidate._id}/notes`
        );
        console.log("Fetched notes from backend:", response.data.notes);
        setNotes(response.data.notes);
      } catch (error) {
        console.error("Error fetching notes", error);
      }
    };
    fetchallNotes();
  }, []);

  const updateHiringStage = async (key, keyModified, value) => {
    console.log("Candidate:", candidate);
    try {
      const response = await fetch("http://localhost:3001/api/update-stage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: candidate._id,
          key,
          keyModified,
        }),
      });

      if (response.status === 400) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return; // Exit the function on error
      }

      const data = await response.json();
      const stages = [
        "applied",
        "profileScreening",
        "shortlisted",
        "interview1",
        "interview2",
        "finalInterview",
      ];

      const index = stages.indexOf(key);
      console.log(value);

      if (index > 0) {
        if (value) {
          const previousStage = stages[index - 1];
          console.log("Previous stage:", previousStage);
          let keyModified;
          if (previousStage === "applied") keyModified = "Applied";
          if (previousStage === "profileScreening")
            keyModified = "Profile Screening";
          if (previousStage === "shortlisted") keyModified = "Shortlisted";
          if (previousStage === "interview1") keyModified = "Interview 1";
          if (previousStage === "interview2") keyModified = "Interview 2";
          if (previousStage === "finalInterview")
            keyModified = "Final Interview";
          updateCandidateStage(candidate._id, keyModified);
          SetProfileStage(keyModified);
        } else {
          updateCandidateStage(candidate._id, keyModified);
          SetProfileStage(keyModified);
        }
      } else {
        console.log("No previous stage available.");
      }

      console.log("Data from API", data);
      const updatedStages = hiringStages.map((stage) => {
        // Check if the key matches the property of the current object
        if (stage.hasOwnProperty(key)) {
          // Toggle the boolean value of the matched key
          return { [key]: !stage[key] }; // flip true -> false or false -> true
        }
        return stage; // Return the stage as is if key doesn't match
      });
      console.log("updating stage with id:", updatedStages);
      setHiringStages(updatedStages);
    } catch (err) {
      console.error("Error updating stages", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleSaveNote = async () => {
    if (newNote.trim() === "") {
      toast.error("Note cannot be empty", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (editIndex !== null) {
      const response = await axios.put(
        `http://localhost:3001/api/${candidate._id}/notes/${editIndex}`,
        {
          updatedNote: newNote,
        }
      );
      console.log("Response data", response);
      // Editing existing note
      const updatedNotes = notes.map((note) =>
        note._id === editIndex ? { ...note, note: newNote } : note
      );

      // Update the notes array with the modified note
      setNotes(updatedNotes);

      // Clear the edit index and input
      setEditIndex(null);
      setNewNote("");
    } else {
      // Adding new note
      const response = await axios.post(
        `http://localhost:3001/api/${candidate._id}/notes`,
        {
          note: newNote,
        }
      );
      console.log("Response data", response);

      setNotes([...notes, response.data]);
    }
    setNewNote(""); // Clear input after saving
  };

  const handleEditNote = (noteId) => {
    setEditIndex(noteId);

    const noteToEdit = notes.find((note) => note._id === noteId);
    if (noteToEdit) {
      setEditIndex(noteId); // Set the current editing note's ID
      setNewNote(noteToEdit.note); // Load selected note content into input for editing
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      // Make an API call to delete the note by noteId
      const response = await axios.delete(
        `http://localhost:3001/api/${candidate._id}/notes/${noteId}`
      );
      console.log("Deleted res", response);
      const updatedNotes = notes.filter((note) => note._id !== noteId);
      setNotes(updatedNotes);
      console.log("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (!candidate) return null;

  const toggleCompletion = async (key, keyModified, value) => {
    console.log("Toggling stage with id:", key);
    setLoading(true);
    setSelectedKey(key);
    try {
      await updateHiringStage(key, keyModified, value);
    } catch (error) {
      console.error("Failed to update stage with key");
    } finally {
      setLoading(false);
      setSelectedKey("");
    }
  };

  const handleToggle = (stageKey) => {
    setExpandedStages((prevState) => ({
      ...prevState,
      [stageKey]: !prevState[stageKey],
    }));
  };

  return (
    <div
      className="flex-1 p-5 flex-column justify-center items-start"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "16px",
        minHeight: "80vh", // changed maxHeight to minHeight to ensure responsiveness for smaller devices profilecard
      }}
    >
      <ToastContainer />
      <header
        style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
      >
        <button onClick={onClose} style={{ color: "blue" }}>
          ← Back
        </button>
        <button style={{ marginLeft: "auto" }}>...</button>
      </header>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#ddd",
            marginRight: "16px",
          }}
        >
          <img src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" />
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
            {candidate.userName}
          </h1>
          <p style={{ color: "gray" }}>
            {candidate.appliedRole} · {candidate.appliedLocation}{" "}
            <StageStyling applicationStage={profileStage} />
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button style={{ marginRight: "8px" }}>📧</button>
          <button></button>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
          marginBottom: "16px",
        }}
      >
        {["Profile", "Resume", "Hiring Stage", "Notes"].map((tab) => (
          <button
            key={tab}
            style={{
              padding: "8px 16px",
              borderBottom: activeTab === tab ? "2px solid blue" : "none",
              color: activeTab === tab ? "blue" : "gray",
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Resume" && (
        <div style={{ padding: "16px", textAlign: "center" }}>
          <DownloadPdf />
        </div>
      )}

      {activeTab == "Profile" && (
        //fetch the profile details
        //display the profile details here
        //example
        <div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Profile Details:
          </h1>
          <p>
            <strong>Name:</strong> {candidate.userName}
            <br />
            <strong>Email:</strong> {candidate.userEmail}
            <br />
            <strong>Phone:</strong> {candidate.userPhone}
            {/* <br />
            <strong>Location:</strong> {candidate.location} */}
          </p>
          {/* Skills Section */}
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              marginTop: "16px",
            }}
          >
            Skills
          </h1>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            {candidate.skills?.map((skill, index) => (
              <li>{skill.name}</li>
            ))}
          </ul>

          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            Socials
          </h1>
          <button>
            <Link to={candidate.socials.linkedin}>
              <img
                src="https://www.linkedin.com/favicon.ico"
                alt="LinkedIn"
                style={{ width: "24px", height: "24px" }}
              />
            </Link>
          </button>
          <button>
            <Link to={candidate.socials.github}>
              <img
                src="https://github.com/favicon.ico"
                alt="GitHub"
                style={{ width: "24px", height: "24px" }}
              />
            </Link>
          </button>
        </div>
      )}

      {activeTab === "Notes" && (
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Notes
          </h2>
          <textarea
            rows={3}
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note"
            className="border border-gray-400"
            style={{
              padding: "8px",
              marginBottom: "8px",
              width: "100%",
            }}
          />
          <button
            onClick={handleSaveNote}
            style={{
              padding: "8px 16px",
              backgroundColor: "blue",
              color: "white",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {editIndex !== null ? "Update Note" : "Save Note"}
          </button>

          {editIndex !== null && (
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "red",
                borderRadius: "4px",
                marginLeft: "6px",
                marginBottom: "16px",
                border: "1px solid red",
              }}
              onClick={() => {
                setEditIndex(null);
                setNewNote("");
              }}
            >
              Cancel
            </button>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              // overflowY: "auto",
              // maxHeight: "80vh",
            }}
          >
            {notes.map((note) => (
              <div
                key={note._id}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    margin: 0,
                    flex: 1,
                    paddingRight: "6px",
                  }}
                >
                  {note.note}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditNote(note._id)}
                    style={{
                      // backgroundColor: "#4A90E2",
                      color: "blue",
                      border: "none",
                      fontSize: "18px",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    style={{
                      // backgroundColor: "#E94E3D",
                      color: "red",
                      border: "none",
                      fontSize: "26px",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab == "Hiring Stage" && (
        <div>
          <div
            style={{
              marginBottom: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Applied Jobs
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>Position</span>
              <span>Location</span>
              <span>Applied date</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{candidate.appliedRole}</span>
              <span>{candidate.appliedLocation}</span>
              <span>
                {new Date(candidate.appliedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Timeline Component */}
          <div className="overflow-y-scroll" style={{ maxHeight: "40vh" }}>
            <VerticalTimeline layout="1-column">
              {hiringStages.map((stage, index) =>
                Object.entries(stage).map(([key, value]) => {
                  console.log(`Key: ${key}, Value: ${value}`);
                  let keyModified;
                  if (key === "applied") keyModified = "Applied";
                  if (key === "profileScreening")
                    keyModified = "Profile Screening";
                  if (key === "shortlisted") keyModified = "Shortlisted";
                  if (key === "interview1") keyModified = "Interview 1";
                  if (key === "interview2") keyModified = "Interview 2";
                  if (key === "finalInterview") keyModified = "Final Interview";

                  return (
                    <>
                      <VerticalTimelineElement
                        key={index}
                        iconStyle={{
                          background: value ? "green" : "#ddd",
                          color: "#fff",
                        }}
                        icon={
                          <span style={{ color: "white" }}>
                            {value ? <TiTick /> : <RxCross2 />}
                          </span>
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3 style={{ fontWeight: "bold" }}>{keyModified}</h3>
                          <button
                            onClick={() => handleToggle(key)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {expandedStages[key] ? "▲" : "▼"}
                          </button>
                        </div>
                        {expandedStages[key] && (
                          <div style={{ marginTop: "8px" }}>
                            <p style={{ color: "gray", fontSize: "14px" }}>
                              Information about the {key} stage. You can mark it
                              as complete or incomplete.
                            </p>
                            <button
                              onClick={() =>
                                toggleCompletion(key, keyModified, value)
                              }
                              style={{
                                padding: "8px 16px",
                                background: value ? "red" : "green",
                                color: "white",
                                borderRadius: "4px",
                                marginTop: "8px",
                              }}
                              disabled={key === selectedKey ? Loading : false}
                            >
                              {value ? "Unmark" : "Completed"}
                            </button>
                          </div>
                        )}
                      </VerticalTimelineElement>
                    </>
                  );
                })
              )}
            </VerticalTimeline>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              style={{
                padding: "6px",
                paddingRight: "4px",
                background: "blue",
                color: "white",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              Move Next Step →
            </button>
            <button
              style={{
                marginLeft: "10px",
                border: "1px solid red",
                color: "red",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
