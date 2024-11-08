import React, { useState } from "react";

const initialHiringStages = [
  { id: 1, name: "Screening", completed: true },
  { id: 2, name: "Design Challenge", completed: true },
  { id: 3, name: "Interview", completed: false },
  { id: 4, name: "Offer", completed: false },
];

const ProfileCard = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState("Hiring Stage");
  const [expandedStage, setExpandedStage] = useState(null);
  const [hiringStages, setHiringStages] = useState(initialHiringStages);

  if (!candidate) return null;

  const toggleCompletion = (stageId) => {
    setHiringStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === stageId ? { ...stage, completed: !stage.completed } : stage
      )
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <button onClick={onClose} style={{ color: "blue" }}>← Back</button>
        <button style={{ marginLeft: "auto" }}>...</button>
      </header>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#ddd",
            marginRight: "16px",
          }}
        >
          <img src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"/>
        </div>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{candidate.userName}</h1>
          <p style={{ color: "gray" }}>
            {candidate.appliedRole} · {candidate.appliedLocation}{" "}
            <span style={{ border: "1px solid gray", padding: "2px 4px", borderRadius: "4px" }}>
              {candidate.applicationStage}
            </span>
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button style={{ marginRight: "8px" }}>📧</button>
          <button>📞</button>
        </div>
      </div>

      <nav style={{ display: "flex", borderBottom: "1px solid #ddd", marginBottom: "16px" }}>
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

      <div style={{ marginBottom: "16px", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Applied Jobs</h2>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>Position</span>
          <span>Location</span>
          <span>Applied date</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{candidate.appliedRole}</span>
          <span>{candidate.appliedLocation}</span>
          <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        {hiringStages.map((stage) => (
          <div key={stage.id} style={{ marginBottom: "8px", border: "1px solid #ddd", borderRadius: "8px", padding: "8px" }}>
            <button
              onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  marginRight: "8px",
                  backgroundColor: stage.completed ? "green" : "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {stage.completed ? "✔️" : stage.id}
              </div>
              <span style={{ flex: "1", textAlign: "left" }}>{stage.name}</span>
              <span>{expandedStage === stage.id ? "▲" : "▼"}</span>
            </button>
            {expandedStage === stage.id && (
              <div style={{ padding: "16px", borderTop: "1px solid #ddd" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>{stage.name} Details</h3>
                <p style={{ color: "gray", fontSize: "14px" }}>
                  Information about the {stage.name} stage. You can mark it as complete or incomplete.
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                  <button
                    onClick={() => toggleCompletion(stage.id)}
                    style={{
                      padding: "8px 16px",
                      background: stage.completed ? "red" : "green",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  >
                    {stage.completed ? "Unmark" : "Completed"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button style={{ padding: "8px", background: "blue", color: "white", borderRadius: "4px", width: "100%" }}>
          Move Next Step →
        </button>
        <button style={{ padding: "8px", border: "1px solid red", color: "red", borderRadius: "4px", width: "100%" }}>
          Reject
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
