"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconUserBolt,
  IconPlus,
  IconBook,
  IconDeviceDesktop,
  IconBriefcase,
  IconChevronLeft,
  IconChevronRight,
  IconNotebook,
  IconRocket,
  IconAward,
  IconUserCheck,
  IconFlag,
  IconBallFootball,
  IconTrash,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import Ruthi_Logo1 from "../assets/Ruthi_Logo1.svg";
import BasicInformationForm from "./ProfilePageComponents/BasicInformationForm";
import Education from "./ProfilePageComponents/Education";
import ExperienceForm from "./ProfilePageComponents/ExperienceForm";
import TechnicalSkills from "./ProfilePageComponents/TechnicalSkills";
import AddSectionModal from "./ProfilePageComponents/AddSectionModal";
import Publications from "./ProfilePageComponents/Publications";
import PersonalProjects from "./ProfilePageComponents/PersonalProjects";
import AwardsAndAchievements from "./ProfilePageComponents/AwardsAndAchievements";
import PositionsOfResponsibility from "./ProfilePageComponents/PositionsOfResponsibility";
import Competitions from "./ProfilePageComponents/Competitions";
import ExtraCurricularActivities from "./ProfilePageComponents/ExtraCurricularActivities";
import OverviewPage from "./ProfilePageComponents/OverviewPage";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { fetchUserProfile } from "../api/userProfileApi";
import {
  personalInformationState,
  socialsState,
  coursesState,
  educationState,
  experienceState,
  publicationsState,
  skillsState,
  personalProjectsState,
  awardsAndAchievementsState,
  positionsOfResponsibilityState,
  competitionsState,
  extracurricularActivitiesState,
  isSubmittedState,
  isParsedResumeState,
} from "../store/atoms/userProfileSate";
import { useCustomToast } from "../components/utils/useCustomToast";

// Update this function outside of the sidebar component
const checkAtomContent = (atoms) => {
  const isEmptyObject = (obj) => {
    return Object.values(obj).every(
      (value) => value === "" || (Array.isArray(value) && value.length === 0)
    );
  };

  for (const atom of atoms) {
    if (Array.isArray(atom)) {
      if (atom.length > 0 && atom.some((item) => !isEmptyObject(item))) {
        return true;
      }
    } else if (typeof atom === "object" && atom !== null) {
      if (!isEmptyObject(atom)) {
        return true;
      }
    }
  }
  return false;
};

const sectionIcons = {
  Publications: IconNotebook,
  "Personal Projects": IconRocket,
  "Awards and Achievements": IconAward,
  "Positions of Responsibility": IconUserBolt,
  Competitions: IconFlag,
  "Extra-curricular Activities": IconBallFootball,
};

const availableSections = [
  "Publications",
  "Personal Projects",
  "Awards and Achievements",
  "Positions of Responsibility",
  "Competitions",
  "Extra-curricular Activities",
];

export default function SideBar() {
  const { authToken } = useAuth();
  const { fetchUserInfo } = useAuth();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manuallyAddedSections, setManuallyAddedSections] = useState([]);
  const [errors, setErrors] = useState({});
  const personalInformation = useRecoilValue(personalInformationState);
  const educations = useRecoilValue(educationState);
  const experiences = useRecoilValue(experienceState);
  const skills = useRecoilValue(skillsState);
  const publications = useRecoilValue(publicationsState);
  const personalProjects = useRecoilValue(personalProjectsState);
  const awardsAndAchievements = useRecoilValue(awardsAndAchievementsState);
  const positionsOfResponsibility = useRecoilValue(
    positionsOfResponsibilityState
  );
  const competitions = useRecoilValue(competitionsState);
  const extracurricularActivities = useRecoilValue(
    extracurricularActivitiesState
  );
  const [selectedSection, setSelectedSection] = useState(() => {
    const hasContent = checkAtomContent([
      personalInformation,
      educations,
      experiences,
      skills,
      publications,
      personalProjects,
      awardsAndAchievements,
      positionsOfResponsibility,
      competitions,
      extracurricularActivities,
    ]);

    return hasContent ? "Overview" : "Basic Information";
  });
  const [isSubmitted, setIsSubmitted] = useRecoilState(isSubmittedState);
  const [invalidSections, setInvalidSections] = useState([]);

  const setPersonalInformation = useSetRecoilState(personalInformationState);
  const setSocials = useSetRecoilState(socialsState);
  const setCourses = useSetRecoilState(coursesState);
  const setEducation = useSetRecoilState(educationState);
  const setExperience = useSetRecoilState(experienceState);
  const setPublications = useSetRecoilState(publicationsState);
  const setSkills = useSetRecoilState(skillsState);
  const setPersonalProjects = useSetRecoilState(personalProjectsState);
  const setAwardsAndAchievements = useSetRecoilState(
    awardsAndAchievementsState
  );
  const setPositionsOfResponsibility = useSetRecoilState(
    positionsOfResponsibilityState
  );
  const setCompetitions = useSetRecoilState(competitionsState);
  const setExtracurricularActivities = useSetRecoilState(
    extracurricularActivitiesState
  );
  const setIsProfileSubmitted = useSetRecoilState(isSubmittedState);
  const setIsParsedResume = useSetRecoilState(isParsedResumeState);

  const [initialDataSections, setInitialDataSections] = useState([]);
  const customToast = useCustomToast();


  function getInvalidSection() {
    if (invalidSections.length > 0) {
      const firstInvalidSection = invalidSections[0];
      // Map the section name to the exact string used in the switch statement
      const sectionMapping = {
        personal_information: "Basic Information",
        education: "Education",
        experience: "Experience",
        skills: "Skills",
        publications: "Publications",
        personal_projects: "Personal Projects",
        awards_and_achievements: "Awards and Achievements",
        position_of_responsibility: "Positions of Responsibility",
        competitions: "Competitions",
        extra_curricular_activities: "Extra-curricular Activities",
      };
      return sectionMapping[firstInvalidSection] || firstInvalidSection;
    }
    return null;
  }

  useEffect(() => {
    const nextSection = getInvalidSection();
    if (nextSection) {
      setSelectedSection(nextSection);
    }
  }, [invalidSections]);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userInfo = await fetchUserInfo(authToken);
        if (!userInfo || !userInfo._id) {
          toast.error("Unable to fetch user information");
          return;
        }

        setIsProfileSubmitted(userInfo.isProfileSubmitted);
        setIsParsedResume(userInfo.isParsedResume);

        // Check atoms for existing data
        const sectionsWithData = [];
        if (
          publications.length > 0 &&
          !sectionsWithData.includes("Publications")
        )
          sectionsWithData.push("Publications");
        if (
          personalProjects.length > 0 &&
          !sectionsWithData.includes("Personal Projects")
        )
          sectionsWithData.push("Personal Projects");
        if (
          awardsAndAchievements.length > 0 &&
          !sectionsWithData.includes("Awards and Achievements")
        )
          sectionsWithData.push("Awards and Achievements");
        if (
          positionsOfResponsibility.length > 0 &&
          !sectionsWithData.includes("Positions of Responsibility")
        )
          sectionsWithData.push("Positions of Responsibility");
        if (
          competitions.length > 0 &&
          !sectionsWithData.includes("Competitions")
        )
          sectionsWithData.push("Competitions");
        if (
          extracurricularActivities.length > 0 &&
          !sectionsWithData.includes("Extra-curricular Activities")
        )
          sectionsWithData.push("Extra-curricular Activities");

        // If there's existing data, set the initial states
        if (sectionsWithData.length > 0) {
          setInitialDataSections(sectionsWithData);
          setManuallyAddedSections(sectionsWithData);
          setSelectedSection("Overview");
        }

        // Fetch user profile data
        const userProfileData = await fetchUserProfile(authToken);
        console.log("userProfileData:", userProfileData);

        // Set all profile sections
        setPersonalInformation(userProfileData.personal_information);
        setSocials(userProfileData.socials);
        setCourses(userProfileData.courses);
        setEducation(userProfileData.education);
        setExperience(userProfileData.experience);
        setPublications(userProfileData.publications);
        setSkills(userProfileData.skills);
        setPersonalProjects(userProfileData.personal_projects);
        setAwardsAndAchievements(userProfileData.awards_and_achievements);
        setPositionsOfResponsibility(
          userProfileData.position_of_responsibility
        );
        setCompetitions(userProfileData.competition);
        setExtracurricularActivities(
          userProfileData.extra_curricular_activities
        );

        // Update sectionsWithData based on fetched data
        if (
          userProfileData.publications?.length > 0 &&
          !sectionsWithData.includes("Publications")
        )
          sectionsWithData.push("Publications");
        if (
          userProfileData.personal_projects?.length > 0 &&
          !sectionsWithData.includes("Personal Projects")
        )
          sectionsWithData.push("Personal Projects");
        if (
          userProfileData.awards_and_achievements?.length > 0 &&
          !sectionsWithData.includes("Awards and Achievements")
        )
          sectionsWithData.push("Awards and Achievements");
        if (
          userProfileData.position_of_responsibility?.length > 0 &&
          !sectionsWithData.includes("Positions of Responsibility")
        )
          sectionsWithData.push("Positions of Responsibility");
        if (
          userProfileData.competitions?.length > 0 &&
          !sectionsWithData.includes("Competitions")
        )
          sectionsWithData.push("Competitions");
        if (
          userProfileData.extra_curricular_activities?.length > 0 &&
          !sectionsWithData.includes("Extra-curricular Activities")
        )
          sectionsWithData.push("Extra-curricular Activities");

        // Remove duplicates from sectionsWithData
        const uniqueSectionsWithData = [...new Set(sectionsWithData)];

        setInitialDataSections(uniqueSectionsWithData);
        setManuallyAddedSections(uniqueSectionsWithData);

        // If there's any data, set the selected section to "Overview"
        if (
          sectionsWithData.length > 0 ||
          Object.keys(userProfileData.personal_information || {}).length > 0
        ) {
          setSelectedSection("Overview");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
  }, [
    authToken,
    fetchUserInfo,
    setPersonalInformation,
    setSocials,
    setCourses,
    setEducation,
    setExperience,
    setPublications,
    setSkills,
    setPersonalProjects,
    setAwardsAndAchievements,
    setPositionsOfResponsibility,
    setCompetitions,
    setExtracurricularActivities,
  ]);

  useEffect(() => {
    if (isSubmitted) {
      setSelectedSection("Overview");
    }
  }, [isSubmitted, setSelectedSection]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initialLinks = [
    { label: "Basic Information", icon: <IconUserCheck />, href: "#" },
    { label: "Education", icon: <IconBook />, href: "#" },
    { label: "Experience", icon: <IconBriefcase />, href: "#" },
    { label: "Skills", icon: <IconDeviceDesktop />, href: "#" },
    {
      label: "Add more",
      icon: <IconPlus />,
      href: "#",
      onClick: () => setIsModalOpen(true),
    },
    {
      label: "Logout",
      icon: <IconArrowLeft />,
      onClick: handleLogout,
    },
  ];

  const [links, setLinks] = useState(initialLinks);

  // New useEffect for updating sidebar links
  useEffect(() => {
    if (isSubmitted) {
      setLinks([
        { label: "Overview", icon: <IconLayoutDashboard />, href: "#" },
        {
          label: "Logout",
          icon: <IconArrowLeft />,
          onClick: handleLogout,
        },
      ]);
    } else {
      const updatedLinks = [
        ...initialLinks.slice(0, -2), // Keep the first 4 default links
        ...manuallyAddedSections.map((section) => ({
          label: section,
          icon: sectionIcons[section] ? (
            React.createElement(sectionIcons[section])
          ) : (
            <IconPlus />
          ),
          href: "#",
          deletable: !initialDataSections.includes(section),
        })),
      ];

      // Add the "Add more" button if there are still sections available to add
      if (manuallyAddedSections.length < availableSections.length) {
        updatedLinks.push({
          label: "Add more",
          icon: <IconPlus />,
          href: "#",
          onClick: () => setIsModalOpen(true),
        });
      }

      updatedLinks.push(initialLinks[initialLinks.length - 1]); // Add the "Logout" link
      setLinks(updatedLinks);
    }
  }, [manuallyAddedSections, isSubmitted, initialDataSections]);

  const handleAddSection = (newSection) => {
    if (!manuallyAddedSections.includes(newSection)) {
      setManuallyAddedSections((prevSections) => [...prevSections, newSection]);
      setSelectedSection(newSection);
    }
  };

  const handleDeleteSection = (sectionToDelete) => {
    if (!initialDataSections.includes(sectionToDelete)) {
      setManuallyAddedSections((prevSections) =>
        prevSections.filter((section) => section !== sectionToDelete)
      );
      if (selectedSection === sectionToDelete) {
        setSelectedSection("Basic Information");
      }
    }
  };

  const sections = [
    "Basic Information",
    "Education",
    "Experience",
    "Skills",
    ...manuallyAddedSections,
  ];
  const currentIndex = sections.indexOf(selectedSection);

  const validateBasicInfo = () => {
    const newErrors = {};
    if (!personalInformation.first_name)
      newErrors.first_name = "First name is required";
    if (!personalInformation.last_name)
      newErrors.last_name = "Last name is required";

    if (!personalInformation.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(personalInformation.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!personalInformation.expected_salary) {
      newErrors.expected_salary = "Expected salary is required";
    } else {
      const salary = Number(personalInformation.expected_salary);
      if (isNaN(salary) || salary < 1 || salary > 99) {
        newErrors.expected_salary = "Expected salary must be between 1 and 99";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      customToast(
        <div>
          <strong>Please fix the following errors:</strong>
          <ul className="mt-2 list-disc list-inside">
            {Object.entries(newErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>,
        "error"
      );
      return false;
    }
    return true;
  };

  const validateEducation = () => {
    if (educations.length === 0) {
      customToast("Please add at least one education entry", "error");
      return false;
    }

    const firstEducation = educations[0];
    const requiredFields = [
      "institution",
      "degree",
      "start_date",
      "cgpa_or_percentage",
    ];
    const missingFields = requiredFields.filter(
      (field) => !firstEducation[field]
    );

    if (missingFields.length > 0) {
      customToast(
        <div>
          <strong>Please fill in all required fields for education:</strong>
          <ul className="mt-2 list-disc list-inside">
            {missingFields.map((field) => (
              <li key={field}>{field.replace("_", " ")}</li>
            ))}
          </ul>
        </div>,
        "error"
      );
      return false;
    }

    return true;
  };

  // Add this new function to validate the current section
  const validateCurrentSection = () => {
    switch (selectedSection) {
      case "Basic Information":
        return validateBasicInfo();
      case "Education":
        return validateEducation();
      // Add more cases for other sections if needed
      default:
        return true;
    }
  };

  // Update the handleNavigation function
  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (!validateCurrentSection()) return;
    }

    const allSections = [
      "Basic Information",
      "Education",
      "Experience",
      "Skills",
      ...manuallyAddedSections,
      "Overview"
    ];

    const currentIndex = allSections.indexOf(selectedSection);
    let newIndex;

    if (direction === "next") {
      newIndex = currentIndex + 1;
    } else {
      newIndex = currentIndex - 1;
    }

    if (newIndex >= 0 && newIndex < allSections.length) {
      setSelectedSection(allSections[newIndex]);
    }

    if (invalidSections.length > 0) {
      const nextSection = getInvalidSection();
      if (nextSection) {
        setSelectedSection(nextSection);
        setInvalidSections(prev => prev.slice(1)); // Remove the first invalid section
        return;
      }
    }
  };

  // const handleOverview = () => {
  //   setSelectedSection("Overview");
  //   setIsModalOpen(false);
  // };

  // const handleStartAddingDetails = () => {
  //   setSelectedSection("Basic Information");
  //   setIsModalOpen(false);
  // };

  const getVisibleLinks = () => {
    if (isSubmitted) {
      return [
        { label: "Overview", icon: <IconLayoutDashboard />, href: "#" },
        {
          label: "Logout",
          icon: <IconArrowLeft />,
          onClick: handleLogout,
        },
      ];
    }
    return links;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Toaster
        toastOptions={{
          // Prevent duplicate toasts
          id: "unique-toast",
          // Custom styles to position the toast
          style: {
            background: "#363636",
            color: "#fff",
            zIndex: 9999,
          },
        }}
      />
      <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
        <SidebarBody className="justify-between py-2">
          <div className="flex flex-col flex-1">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-4 flex flex-col gap-1.5">
              {getVisibleLinks().map((link, idx) => (
                <div key={idx} className="group relative flex items-center">
                  <SidebarLink
                    link={link}
                    onClick={() => {
                      if (link.onClick) {
                        link.onClick();
                      } else {
                        setSelectedSection(link.label);
                      }
                    }}
                    isActive={selectedSection === link.label}
                    className="w-full py-1 text-sm"
                  />
                  {link.deletable && (
                    <button
                      onClick={() => handleDeleteSection(link.label)}
                      className="absolute right-2 p-0.5 text-red-500 hover:text-red-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconTrash size={12} /> {/* Reduced icon size */}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {!isSubmitted && (
            <SidebarLink
              link={{
                label: "Overview",
                icon: <IconLayoutDashboard />,
                href: "#",
              }}
              onClick={() => setSelectedSection("Overview")}
              isActive={selectedSection === "Overview"}
              className="mt-2 py-1 text-sm"
            />
          )}
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard
            selectedSection={selectedSection}
            manuallyAddedSections={manuallyAddedSections}
            errors={errors}
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
            setInvalidSections={setInvalidSections}
          />
        </main>
        {!isSubmitted && selectedSection !== "Overview" && (
          <div className="p-4 bg-transparent z-10">
            <div className="max-w-4xl mx-auto w-full flex justify-between">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconChevronLeft className="w-5 h-5 inline-block mr-1" />
                Previous
              </button>
              <button
                onClick={() => handleNavigation("next")}
                className="px-4 py-2 bg-orange-600 text-white rounded"
              >
                Next
                <IconChevronRight className="w-5 h-5 inline-block ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSection={handleAddSection}
        selectedSections={manuallyAddedSections}
        setSelectedSection={setSelectedSection}
      />
    </div>
  );
}

const Dashboard = ({ selectedSection, errors, setInvalidSections }) => {
  console.log("Current selected section:", selectedSection); // Add this line for debugging

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {(() => {
            switch (selectedSection) {
              case "Basic Information":
                return <BasicInformationForm errors={errors} />;
              case "Education":
                return <Education />;
              case "Experience":
                return <ExperienceForm />;
              case "Skills":
                return <TechnicalSkills />;
              case "Publications":
                return <Publications />;
              case "Personal Projects":
                return <PersonalProjects />;
              case "Awards and Achievements":
                return <AwardsAndAchievements />;
              case "Positions of Responsibility":
                return <PositionsOfResponsibility />;
              case "Competitions":
                return <Competitions />;
              case "Extra-curricular Activities":
                return <ExtraCurricularActivities />;
              case "Overview":
                return <OverviewPage setInvalidSections={setInvalidSections} />;
              default:
                console.log("No matching section found for:", selectedSection); // Add this line for debugging
                return <div>Select a section</div>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <a href="/" className="flex items-center justify-center relative z-20">
      <img
        src={Ruthi_Logo1}
        alt="Ruthi Logo"
        className="h-11 w-15 object-contain"
      />
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a href="/" className="flex items-center justify-center relative z-20">
      <img
        src={Ruthi_Logo1}
        alt="Ruthi Logo"
        className="h-9 w-10 object-contain"
      />
    </a>
  );
};
