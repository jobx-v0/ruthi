import { atom } from "recoil";
import { getPersistedData } from "./persistedData";

const persistedData = getPersistedData();

// Atom for personal information
export const personalInformationState = atom({
  key: "personalInformationState",
  default: persistedData.personalInformation,
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("personalInformation", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for socials
export const socialsState = atom({
  key: "socialsState",
  default: persistedData.socials, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("socials", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for courses
export const coursesState = atom({
  key: "coursesState",
  default: persistedData.courses, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("courses", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for education
export const educationState = atom({
  key: "educationState",
  default: persistedData.education, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("education", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for experience
export const experienceState = atom({
  key: "experienceState",
  default: persistedData.experience, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("experience", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for publications
export const publicationsState = atom({
  key: "publicationsState",
  default: persistedData.publications, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("publications", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for skills
export const skillsState = atom({
  key: "skillsState",
  default: persistedData.skills, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("skills", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for personal projects
export const personalProjectsState = atom({
  key: "personalProjectsState",
  default: persistedData.personalProjects, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("personalProjects", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for awards and achievements
export const awardsAndAchievementsState = atom({
  key: "awardsAndAchievementsState",
  default: persistedData.awardsAndAchievements, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("awardsAndAchievements", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for positions of responsibility
export const positionsOfResponsibilityState = atom({
  key: "positionsOfResponsibilityState",
  default: persistedData.positionsOfResponsibility, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("positionsOfResponsibility", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for competitions
export const competitionsState = atom({
  key: "competitionsState",
  default: persistedData.competitions, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("competitions", JSON.stringify(newData));
      });
    },
  ],
});

// Atom for extracurricular activities
export const extracurricularActivitiesState = atom({
  key: "extracurricularActivitiesState",
  default: persistedData.extracurricularActivities, // Load from localStorage or default value
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("extracurricularActivities", JSON.stringify(newData));
      });
    },
  ],
});

export const isSubmittedState = atom({
  key: "isSubmittedState",
  default: persistedData.isSubmitted,
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("isSubmitted", JSON.stringify(newData));
      });
    },
  ],
});

export const isParsedResumeState = atom({
  key: "isParsedResumeState",
  default: persistedData.isParsedResume,
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("isParsedResume", JSON.stringify(newData));
      });
    },
  ],
});

export const isParsedResumeFirstTimeState = atom({
  key: "isParsedResumeFirstTimeState",
  default: persistedData.isParsedResumeFirstTime,
  effects: [
    ({ onSet }) => {
      onSet((newData) => {
        localStorage.setItem("isParsedResumeFirstTime", JSON.stringify(newData));
        console.log("isParsedResumeFirstTimeState", newData);
      });
    },
  ],
});
