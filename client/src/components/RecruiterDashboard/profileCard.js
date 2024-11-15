import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import axios from "axios"; // Import axios

const ProfileCard = ({ candidate, onClose, updateCandidateStage }) => {
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${candidate._id}/stages`); 
        const data = response.data;
        console.log("Stages from backend:", data.stage);

        const result = Object.entries(data.stage).map(([key, value]) => {
          return { [key]: value };
        });
        console.log("result:", result);
        setHiringStages(result);
      } catch (error) {
        console.error("Error fetching hiring stages", error);
      }
    };

    if (candidate?._id) {
      fetchHiringStages();
    }
  }, [candidate]);

  const updateHiringStage = async (key) => {
    console.log("Candidate:", candidate);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-stage`, {
        applicationId: candidate._id,
        key: key,
      });

      const data = response.data;
      updateCandidateStage(candidate._id, key);
      SetProfileStage(key);
      console.log("Data from API", data);
    } catch (err) {
      console.error("Error updating stages", err);
    }
  };

  const handleSaveNote = () => {
    if (editIndex !== null) {
      // Editing existing note
      setNotes((prevNotes) =>
        prevNotes.map((note, index) => (index === editIndex ? newNote : note))
      );
      setEditIndex(null);
    } else {
      // Adding new note
      setNotes([...notes, newNote]);
    }
    setNewNote(""); // Clear input after saving
  };

  const handleEditNote = (index) => {
    setEditIndex(index);
    setNewNote(notes[index]); // Load selected note into input for editing
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index)); // Delete selected note
  };

  if (!candidate) return null;

  const toggleCompletion = async (key) => {
    console.log("Toggling stage with id:", key);
    setLoading(true);
    setSelectedKey(key);
    try {
      await updateHiringStage(key);
      const updatedStages = hiringStages.map((stage) => {
        // Check if the key matches the property of the current object
        if (stage.hasOwnProperty(key)) {
          return { [key]: !stage[key] };
        }
        return stage; // Return the stage as is if key doesn't match
      });
      console.log("updating stage with id:", updatedStages);
      setHiringStages(updatedStages);
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
        padding: "16px", // Reduced padding here
        overflowY: "auto",
        maxHeight: "80vh", // Adjusted max height to ensure responsiveness
        marginTop: "8px", // Adjusted max height to ensure responsiveness
      }}
    >
      <header
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
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
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#ddd",
            marginRight: "16px",
          }}
        >
          <img src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" />
        </div>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
            {candidate.userName}
          </h1>
          <p style={{ color: "gray" }}>
            {candidate.appliedRole} · {candidate.appliedLocation}{" "}
            <span
              style={{
                border: "1px solid gray",
                padding: "2px 4px",
                borderRadius: "4px",
              }}
            >
              {profileStage}
            </span>
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
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note"
            style={{ padding: "8px", marginBottom: "8px", width: "100%" }}
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

          <div>
            {notes.map((note, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <p>{note}</p>
                <button
                  onClick={() => handleEditNote(index)}
                  style={{ color: "blue", marginRight: "8px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(index)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
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
          <div>
            <VerticalTimeline layout="1-column">
              {hiringStages.map((stage, index) =>
                Object.entries(stage).map(([key, value]) => {
                  console.log(`Key: ${key}, Value: ${value}`);
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
                          <h3 style={{ fontWeight: "bold" }}>{key}</h3>
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
                              onClick={() => toggleCompletion(key)}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              style={{
                padding: "8px",
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
                padding: "8px",
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
