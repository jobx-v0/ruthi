import React, { useEffect, useState } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconAward,
  IconCertificate,
  IconTrophy,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconBallFootball,
} from "@tabler/icons-react";
import { Rocket, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRecoilState } from "recoil";
import ThankyouCard from "./ThankyouCard";
import { useRecoilValue } from "recoil";
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
  isParsedResumeFirstTimeState,
} from "../../store/atoms/userProfileSate";
import {
  isValidData,
  hasAnyData,
  requiredFields,
} from "../../validators/validData";
import axios from "axios";
import Loader from "../../components/utils/Loader";
import {
  personalInfoSchema,
  socialsSchema,
  educationSchema,
  courseSchema,
  experienceSchema,
  projectSchema,
  awardSchema,
  activitySchema,
  competitionSchema,
  publicationSchema,
  positionSchema,
} from "../../validators/ZodSchema";
import { useCustomToast } from "../../components/utils/useCustomToast";
import { updateUserAPI } from "../../api/authApi";

const SectionTitle = ({ title, icon }) => (
  <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center">
    {icon}
    <span className="ml-2">{title}</span>
  </h2>
);

const Section = ({ title, children, isEmpty, icon }) => {
  if (isEmpty) return null;
  return (
    <section className="mb-6">
      <SectionTitle title={title} icon={icon} />
      {children}
    </section>
  );
};

const ResumePage = ({ content }) => (
  <div className=" bg-white shadow-lg p-4 mx-auto my-2 max-w-4xl w-full text-sm">
    {content}
  </div>
);
const REACT_APP_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL + "/api/user-profile";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const renderDescription = (description) => {
  if (
    !description ||
    description === "" ||
    (Array.isArray(description) && description.length === 0)
  ) {
    return null;
  }

  if (Array.isArray(description)) {
    return description.map((item, idx) => <li key={idx}>{item}</li>);
  } else if (typeof description === "string") {
    return description
      .split("\n")
      .filter((item) => item.trim() !== "")
      .map((item, idx) => <li key={idx}>{item}</li>);
  } else {
    return <li>{String(description)}</li>;
  }
};

export default function OverviewPage({ setInvalidSections }) {
  const showToast = useCustomToast();
  const { fetchUserInfo, authToken } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const personal_information = useRecoilValue(personalInformationState);
  const socials = useRecoilValue(socialsState);
  const courses = useRecoilValue(coursesState);
  const education = useRecoilValue(educationState);
  const experience = useRecoilValue(experienceState);
  const publications = useRecoilValue(publicationsState);
  const skills = useRecoilValue(skillsState);
  const personalProjects = useRecoilValue(personalProjectsState);
  const awardsAndAchievements = useRecoilValue(awardsAndAchievementsState);
  const positionsOfResponsibility = useRecoilValue(
    positionsOfResponsibilityState
  );
  const competitions = useRecoilValue(competitionsState);
  const extracurricularActivities = useRecoilValue(
    extracurricularActivitiesState
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useRecoilState(isSubmittedState);
  const [isParsed, setIsParsed] = useRecoilState(isParsedResumeState);
  const [isParsedFirstTime, setIsParsedFirstTime] = useRecoilState(
    isParsedResumeFirstTimeState
  );

  useEffect(() => {
    const getUserInfo = async () => {
      if (authToken) {
        const info = await fetchUserInfo(authToken);
        setUserInfo(info);
      }
    };
    const updateIsParsedFirstTime = async () => {
      await updateUserAPI({
        data: { isParsedResumeFirstTime: false },
        authToken: authToken,
      });
    };
    if (isParsedFirstTime) {
      showToast(
        "We've worked our magic with our resume parser! We've done our best to extract your information.",
        "success"
      );
      setIsParsedFirstTime(false);
      updateIsParsedFirstTime();
    }
    getUserInfo();
  }, [authToken]);

  console.log("rendering again");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dataToSubmit = {
        personal_information: {
          ...personal_information,
          email: userInfo.email,
        },
        socials,
        courses,
        education,
        experience,
        publications,
        skills,
        personal_projects: personalProjects,
        awards_and_achievements: awardsAndAchievements,
        position_of_responsibility: positionsOfResponsibility,
        competitions,
        extra_curricular_activities: extracurricularActivities,
      };

      console.log("dataToSubmit", dataToSubmit);

      const invalidSections = [];

      // Helper function to check required fields
      const checkRequiredFields = (section, data) => {
        const required = requiredFields[section];
        if (!required) return true;

        return required.every((field) => {
          if (section === "experience" && field === "end_date") {
            return data.end_date || data.currently_working;
          }
          return (
            data[field] !== undefined &&
            data[field] !== null &&
            data[field] !== ""
          );
        });
      };

      // Validate personal information
      try {
        personalInfoSchema.parse(dataToSubmit.personal_information);
        if (
          !checkRequiredFields(
            "personal_information",
            dataToSubmit.personal_information
          )
        ) {
          invalidSections.push("personal_information");
        }
      } catch (error) {
        invalidSections.push("personal_information");
      }

      // Validate socials (no required fields, just use Zod schema)
      try {
        socialsSchema.parse(dataToSubmit.socials);
      } catch (error) {
        invalidSections.push("socials");
      }

      // Validate education
      if (isValidData(dataToSubmit.education)) {
        dataToSubmit.education.forEach((edu, index) => {
          try {
            const result = educationSchema.safeParse(edu);
            if (!result.success) {
              console.error(
                `Education validation error for item ${index}:`,
                result.error
              );
              if (!invalidSections.includes("education")) {
                invalidSections.push("education");
              }
            } else if (!checkRequiredFields("education", edu)) {
              console.error(
                `Required fields missing in education item ${index}`
              );
              if (!invalidSections.includes("education")) {
                invalidSections.push("education");
              }
            }
          } catch (error) {
            console.error(
              `Unexpected error in education validation for item ${index}:`,
              error
            );
            if (!invalidSections.includes("education")) {
              invalidSections.push("education");
            }
          }
        });
      }

      // Validate courses
      if (isValidData(dataToSubmit.courses)) {
        dataToSubmit.courses.forEach((course, index) => {
          try {
            courseSchema.parse(course);
            if (!checkRequiredFields("courses", course)) {
              if (!invalidSections.includes("courses")) {
                invalidSections.push("courses");
              }
            }
          } catch (error) {
            if (!invalidSections.includes("courses")) {
              invalidSections.push("courses");
            }
          }
        });
      }

      console.log(
        "experience that is getting validated: ",
        dataToSubmit.experience
      );
      // Validate experience
      if (isValidData(dataToSubmit.experience)) {
        dataToSubmit.experience.forEach((exp, index) => {
          try {
            const result = experienceSchema.safeParse(exp);

            if (!result.success) {
              // If validation fails, log the error and mark the experience section as invalid
              console.error(
                `Experience validation error for item ${index}:`,
                result.error
              );
              if (!invalidSections.includes("experience")) {
                invalidSections.push("experience");
              }
            } else {
              // Dynamically check for required fields based on `currently_working`
              const currentlyWorking = exp.currently_working;

              // If `currently_working` is true, allow `end_date` to be null
              if (
                !currentlyWorking &&
                (!exp.end_date || exp.end_date === null)
              ) {
                console.error(
                  `End date is required in experience item ${index} if not currently working.`
                );
                if (!invalidSections.includes("experience")) {
                  invalidSections.push("experience");
                }
              }

              // Check other required fields
              if (!checkRequiredFields("experience", exp)) {
                console.error(
                  `Required fields missing in experience item ${index}`
                );
                if (!invalidSections.includes("experience")) {
                  invalidSections.push("experience");
                }
              }
            }
          } catch (error) {
            console.error(
              `Unexpected error in experience validation for item ${index}:`,
              error
            );
            if (!invalidSections.includes("experience")) {
              invalidSections.push("experience");
            }
          }
        });
      }

      // Validate personal projects
      if (isValidData(dataToSubmit.personal_projects)) {
        dataToSubmit.personal_projects.forEach((project, index) => {
          try {
            projectSchema.parse(project);
            if (!checkRequiredFields("personal_projects", project)) {
              if (!invalidSections.includes("personal_projects")) {
                invalidSections.push("personal_projects");
              }
            }
          } catch (error) {
            if (!invalidSections.includes("personal_projects")) {
              invalidSections.push("personal_projects");
            }
          }
        });
      }

      // Validate awards and achievements (no required fields, just use Zod schema)
      if (isValidData(dataToSubmit.awards_and_achievements)) {
        dataToSubmit.awards_and_achievements.forEach((award, index) => {
          try {
            awardSchema.parse(award);
          } catch (error) {
            if (!invalidSections.includes("awards_and_achievements")) {
              invalidSections.push("awards_and_achievements");
            }
          }
        });
      }

      // Validate extra curricular activities (no required fields, just use Zod schema)
      if (isValidData(dataToSubmit.extra_curricular_activities)) {
        dataToSubmit.extra_curricular_activities.forEach((activity, index) => {
          try {
            activitySchema.parse(activity);
          } catch (error) {
            if (!invalidSections.includes("extra_curricular_activities")) {
              invalidSections.push("extra_curricular_activities");
            }
          }
        });
      }

      // Validate competitions
      if (isValidData(dataToSubmit.competitions)) {
        dataToSubmit.competitions.forEach((competition, index) => {
          try {
            competitionSchema.parse(competition);
            if (!checkRequiredFields("competitions", competition)) {
              if (!invalidSections.includes("competitions")) {
                invalidSections.push("competitions");
              }
            }
          } catch (error) {
            if (!invalidSections.includes("competitions")) {
              invalidSections.push("competitions");
            }
          }
        });
      }

      // Validate publications
      if (isValidData(dataToSubmit.publications)) {
        dataToSubmit.publications.forEach((publication, index) => {
          try {
            publicationSchema.parse(publication);
            if (!checkRequiredFields("publications", publication)) {
              if (!invalidSections.includes("publications")) {
                invalidSections.push("publications");
              }
            }
          } catch (error) {
            if (!invalidSections.includes("publications")) {
              invalidSections.push("publications");
            }
          }
        });
      }

      // Validate positions of responsibility
      if (isValidData(dataToSubmit.position_of_responsibility)) {
        dataToSubmit.position_of_responsibility.forEach((position, index) => {
          try {
            positionSchema.parse(position);
            if (!checkRequiredFields("position_of_responsibility", position)) {
              if (!invalidSections.includes("position_of_responsibility")) {
                invalidSections.push("position_of_responsibility");
              }
            }
          } catch (error) {
            if (!invalidSections.includes("position_of_responsibility")) {
              invalidSections.push("position_of_responsibility");
            }
          }
        });
      }

      if (invalidSections.length > 0) {
        showToast(
          `Please fix the errors in the following sections: ${invalidSections.join(
            ", "
          )}`,
          "error"
        );
        setIsLoading(false);
        setInvalidSections(invalidSections);
        return;
      }

      console.log(
        "Data being submitted:",
        JSON.stringify(dataToSubmit, null, 2)
      );

      // First, check if a profile exists
      try {
        // Profile exists, update it
        const updateResponse = await axios.put(
          `${BACKEND_URL}/api/user-profile`,
          dataToSubmit,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("Profile updated successfully:", updateResponse.data);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
      
      showToast("Profile submitted successfully!", "success");
      await axios.put(
        `${BACKEND_URL}/api/auth/update`,
        { isProfileSubmitted: true },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting profile:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        showToast(
          `Failed to submit profile: ${
            error.response.data.message || "Unknown error"
          }`,
          "error"
        );
      } else if (error.request) {
        showToast(
          "Failed to submit profile. No response received from server.",
          "error"
        );
      } else {
        showToast("Failed to submit profile. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <ThankyouCard />;
  }

  if (!hasAnyData(personal_information)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <IconUser className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Resume is Empty
          </h2>
          <p className="text-gray-600 mb-4">
            Please enter your details in the various sections to build your
            resume.
          </p>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {isValidData(personal_information) && (
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {personal_information?.first_name} {personal_information?.last_name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
            {personal_information?.email && (
              <span className="flex items-center">
                <IconMail className="w-4 h-4 mr-1" />
                <span className="break-all">{personal_information.email}</span>
              </span>
            )}
            {personal_information?.phone && (
              <span className="flex items-center">
                <IconPhone className="w-4 h-4 mr-1" />
                {personal_information.phone}
              </span>
            )}
            {socials?.github && (
              <a
                href={`https://github.com/${socials.github}`}
                className="flex items-center hover:text-blue-500"
              >
                <IconBrandGithub className="w-4 h-4 mr-1" />
                <span className="break-all">{socials.github}</span>
              </a>
            )}
            {socials?.linkedin && (
              <a
                href={`https://linkedin.com/in/${socials.linkedin}`}
                className="flex items-center hover:text-blue-500"
              >
                <IconBrandLinkedin className="w-4 h-4 mr-1" />
                <span className="break-all">{socials.linkedin}</span>
              </a>
            )}
          </div>
        </header>
      )}

      <Section
        title="Skills"
        icon={<IconCode className="w-5 h-5" />}
        isEmpty={!isValidData(skills)}
      >
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
          {skills?.map((skill, index) => (
            <li key={index} className="text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>{skill.skill_name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Education"
        icon={<IconSchool className="w-5 h-5" />}
        isEmpty={!isValidData(education)}
      >
        <div className="space-y-4">
          {education?.filter(isValidData).map((edu, index) => (
            <div key={edu.id || index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">
                  {edu.institution}
                </h3>
                <span className="text-gray-600">
                  {edu.start_date ? new Date(edu.start_date).getFullYear() : ""}{" "}
                  -{" "}
                  {edu.end_date
                    ? new Date(edu.end_date).getFullYear()
                    : "Present"}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                <li>{edu.degree}</li>
                {edu.cgpa_or_percentage && (
                  <li>CGPA/Percentage: {edu.cgpa_or_percentage}</li>
                )}
                {renderDescription(edu.description)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Work Experience"
        icon={<IconBriefcase className="w-5 h-5" />}
        isEmpty={!isValidData(experience)}
      >
        <div className="space-y-4">
          {experience?.filter(isValidData).map((exp, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">
                  {exp.position} - {exp.company}
                </h3>
                <span className="text-gray-600">
                  {exp.start_date &&
                    new Date(exp.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                  -
                  {exp.currently_working
                    ? " Present"
                    : exp.end_date
                    ? new Date(exp.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : " Present"}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {renderDescription(exp.description)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {isValidData(personalProjects) && (
        <Section
          title="Projects"
          icon={<Rocket className="w-5 h-5" />}
          isEmpty={!isValidData(personalProjects)}
        >
          <div className="space-y-4">
            {personalProjects?.filter(isValidData).map((project, index) => (
              <div key={index}>
                <div className="flex flex-col md:flex-row justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <span className="text-gray-600">
                    {project.start_date &&
                      new Date(project.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-500 hover:underline block mb-1 break-all"
                  >
                    {project.link}
                  </a>
                )}
                <ul className="list-disc pl-5 text-gray-600">
                  {Array.isArray(project.description) ? (
                    project.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  ) : typeof project.description === "string" ? (
                    project.description
                      .split("\n")
                      .map((item, idx) => <li key={idx}>{item}</li>)
                  ) : project.description ? (
                    <li>{String(project.description)}</li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Positions of Responsibility"
        icon={<IconAward className="w-5 h-5" />}
        isEmpty={!isValidData(positionsOfResponsibility)}
      >
        <div className="space-y-4">
          {positionsOfResponsibility
            ?.filter(isValidData)
            .map((position, index) => (
              <div key={position.id || index}>
                <div className="flex flex-col md:flex-row justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {position.title} - {position.organization}
                  </h3>
                  <span className="text-gray-600">
                    {position.start_date &&
                      new Date(position.start_date).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      )}{" "}
                    -
                    {position.end_date
                      ? new Date(position.end_date).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" }
                        )
                      : "Present"}
                  </span>
                </div>
                <ul className="list-disc pl-5 text-gray-600">
                  {Array.isArray(position.description) ? (
                    position.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  ) : typeof position.description === "string" ? (
                    <li>{position.description}</li>
                  ) : null}
                </ul>
              </div>
            ))}
        </div>
      </Section>

      <Section
        title="Competitions"
        icon={<IconTrophy className="w-5 h-5" />}
        isEmpty={!isValidData(competitions)}
      >
        <div className="space-y-4">
          {competitions?.map((competition, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">
                  {competition.name}
                </h3>
                <span className="text-gray-600">
                  {competition.date &&
                    new Date(competition.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(competition.description)
                  ? competition.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  : typeof competition.description === "string"
                  ? competition.description
                      .split("\n")
                      .map((item, idx) => <li key={idx}>{item}</li>)
                  : null}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Publications"
        icon={<BookOpen className="w-5 h-5" />}
        isEmpty={!isValidData(publications)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {publications?.map((publication, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-semibold">{publication.name}</span>
              {publication.link && (
                <a
                  href={publication.link}
                  className="ml-1 text-blue-500 hover:underline"
                >
                  [Link]
                </a>
              )}
              <span className="ml-1 text-gray-600">
                {publication.date &&
                  `(${new Date(publication.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })})`}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Courses"
        icon={<IconCertificate className="w-5 h-5" />}
        isEmpty={!isValidData(courses)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {courses?.map((course, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-semibold">{course.course_name}</span>
              {course.course_provider && (
                <span className="text-gray-600">
                  {" "}
                  - {course.course_provider}
                </span>
              )}
              <span className="ml-1 text-gray-600">
                {course.completion_date &&
                  `(Completed: ${new Date(
                    course.completion_date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })})`}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Achievements"
        icon={<IconTrophy className="w-5 h-5" />}
        isEmpty={!isValidData(awardsAndAchievements)}
      >
        <ul className="list-disc pl-5 space-y-1">
          {awardsAndAchievements?.map((award, index) => (
            <li key={index} className="text-gray-700">
              {typeof award === "string" ? award : award.name}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Extra Curricular Activities"
        icon={<IconBallFootball className="w-5 h-5" />}
        isEmpty={!isValidData(extracurricularActivities)}
      >
        <ul className="list-disc pl-5 space-y-1">
          {extracurricularActivities?.map((activity, index) => (
            <li key={index} className="text-gray-700">
              {typeof activity === "string" ? activity : activity.name}
            </li>
          ))}
        </ul>
      </Section>

      {hasAnyData(personal_information) && (
        <div className="mt-8 text-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Profile"}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto bg-gray-200">
        {isLoading ? <Loader /> : <ResumePage content={content} />}
      </div>
    </div>
  );
}
