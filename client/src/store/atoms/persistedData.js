export const getPersistedData = () => {
  const safeJSONParse = (key, defaultValue) => {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Error parsing ${key} from localStorage:`, e);
      return defaultValue;
    }
  };

  const personalInformation = safeJSONParse("personalInformation", {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const socials = safeJSONParse("socials", {
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  });

  const courses = safeJSONParse("courses", [
    {
      course_name: "",
      course_link: "",
      course_provider: "",
      completion_date: "",
    },
  ]);

  const education = safeJSONParse("education", [
    {
      institution: "",
      degree: "",
      start_date: "",
      end_date: "",
      cgpa_or_percentage: "",
      description: [],
    },
  ]);

  const experience = safeJSONParse("experience", []);

  const publications = safeJSONParse("publications", []);

  const skills = safeJSONParse("skills", [
    {
      skill_name: "",
      skill_proficiency: "",
    },
  ]);

  const personalProjects = safeJSONParse("personalProjects", []);

  const awardsAndAchievements = safeJSONParse("awardsAndAchievements", []);

  const positionsOfResponsibility = safeJSONParse(
    "positionsOfResponsibility",
    []
  );

  const competitions = safeJSONParse("competitions", []);

  const extracurricularActivities = safeJSONParse(
    "extracurricularActivities",
    []
  );

  const isSubmitted = safeJSONParse("isSubmitted", false);

  const isParsedResume = safeJSONParse("isParsedResume", false);

  const isParsedResumeFirstTime = safeJSONParse("isParsedResumeFirstTime", false);

  return {
    personalInformation,
    socials,
    courses,
    education,
    experience,
    publications,
    skills,
    personalProjects,
    awardsAndAchievements,
    positionsOfResponsibility,
    competitions,
    extracurricularActivities,
    isSubmitted,
    isParsedResume,
    isParsedResumeFirstTime,
  };
};
