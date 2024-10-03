export const getPersistedData = () => {
    const personalInformation = JSON.parse(localStorage.getItem("personalInformation")) || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    };
    const socials = JSON.parse(localStorage.getItem("socials")) || {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    };
    const courses = JSON.parse(localStorage.getItem("courses")) || [
      {
        course_name: "",
        course_link: "",
        course_provider: "",
        completion_date: "",
      },
    ];
    const education = JSON.parse(localStorage.getItem("education")) || [
      {
        institution: "",
        degree: "",
        start_date: "",
        end_date: "",
        cgpa_or_percentage: "",
        description: [],
      },
    ];
    const experience = JSON.parse(localStorage.getItem("experience")) || [];
    const publications = JSON.parse(localStorage.getItem("publications")) || [
      {
        name: "",
        link: "",
        date: "",
      },
    ];
    const skills = JSON.parse(localStorage.getItem("skills")) || [
      {
        skill_name: "",
        skill_proficiency: "",
      },
    ];
    const personalProjects = JSON.parse(localStorage.getItem("personalProjects")) || [
      {
        name: "",
        description: [],
        link: "",
        start_date: "",
        end_date: "",
      },
    ];
    const awardsAndAchievements = JSON.parse(localStorage.getItem("awardsAndAchievements")) || [];
    const positionsOfResponsibility = JSON.parse(localStorage.getItem("positionsOfResponsibility")) || [
      {
        title: "",
        organization: "",
        start_date: "",
        end_date: "",
        description: [],
      },
    ];
    const competitions = JSON.parse(localStorage.getItem("competitions")) || [];
    const extracurricularActivities = JSON.parse(localStorage.getItem("extracurricularActivities")) || [];
    const isSubmitted = JSON.parse(localStorage.getItem("isSubmitted")) || false;
    const isParsedResume = JSON.parse(localStorage.getItem("isParsedResume")) || false;

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
    };
  };