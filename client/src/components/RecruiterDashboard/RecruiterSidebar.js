// import React from "react";
import CandidatesApplied from "./CandidatesApplied";
import JobList from "./JobCards";
import React, { useState } from "react";

import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import { IconPlus, IconEdit, IconUsers, IconFileText, IconList, IconTrash, IconUser } from "@tabler/icons-react";

const DashboardSidebar = ({ selectedSection, setSelectedSection }) => {
  // Define sidebar sections with labels and icons
  const sections = [
    { label: "Candidates Applied", icon: <IconUsers />, key: "Candidates Applied" },
    { label: "Jobs", icon: <IconList />, key: "Job List" },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        {/* Map through sections to create sidebar links */}
        {sections.map((section) => (
          <SidebarLink
            key={section.key}
            link={{
              href: "#",
              label: section.label,
              icon: section.icon,
            }}
            isActive={selectedSection === section.key}
            onClick={() => setSelectedSection(section.key)}
          />
        ))}
      </SidebarBody>
    </Sidebar>
  );
};

const MainReqDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Job List");

  // Render components based on selectedSection
  const renderContent = () => {
    switch (selectedSection) {
      case "Candidates Applied":
        return <CandidatesApplied />;
      case "Job List":
        return <JobList />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for navigation */}
      <DashboardSidebar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainReqDashboard;
