import CandidatesApplied from "./CandidatesApplied";
import JobList from "./JobCards";
import React, { useState } from "react";

import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import { IconUsers, IconList } from "@tabler/icons-react";

const DashboardSidebar = ({ selectedSection, setSelectedSection }) => {
  const sections = [
    { label: "Jobs", icon: <IconList />, key: "Job List" },
    { label: "Candidates Applied", icon: <IconUsers />, key: "Candidates Applied" },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        {/* Map through sections to create sidebar links */}
        {sections.map((section, index) => (
          <SidebarLink
            key={section.key}
            link={{
              href: "#",
              label: section.label,
              icon: section.icon,
            }}
            isActive={selectedSection === section.key}
            onClick={() => setSelectedSection(section.key)}
            style={{
                marginBottom: index !== sections.length - 1 ? "10px" : "0px", // Add space between links
              }}
          />
        ))}
      </SidebarBody>
    </Sidebar>
  );
};

const MainReqDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Job List");

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
      <DashboardSidebar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      <div className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainReqDashboard;
