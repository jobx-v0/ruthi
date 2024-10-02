import React, { useEffect, useState, useCallback } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconAward,
  IconCertificate,
  IconTrophy,
  IconHeart,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconBallFootball
} from '@tabler/icons-react';
import {Rocket, BookOpen} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRecoilState,useRecoilValue,useSetRecoilState } from 'recoil';
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
  isParsedResumeState
} from '../../store/atoms/userProfileSate';
import ThankyouCard from './ThankyouCard';
import { isSubmittedState } from '../../store/atoms/userProfileSate';

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
  <div className="bg-white shadow-lg p-4 mx-auto my-2 max-w-4xl w-full text-sm">
    {content}
  </div>
);

const isValidData = (data) => {
  if (data == null) {
    return false;
  }
  if (Array.isArray(data)) {
    return data.length > 0 && data.some(item => 
      item != null && Object.entries(item).some(([key, value]) => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
      )
    );
  }
  if (typeof data === 'object') {
    return Object.values(data).some(value => 
      value !== null && 
      value !== undefined && 
      value !== '' && 
      (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
    );
  }
  return data !== null && data !== undefined && data !== '';
};

const hasAnyData = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return false;
  }
  return Object.values(profile).some(isValidData);
};

const isValidProject = (data) => {
  if (data == null) {
    return false;
  }
  if (Array.isArray(data)) {
    // console.log("project array data",data);
    return data.length > 0 && data.some(item => 
      item != null && Object.entries(item).some(([key, value]) => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
      )
    );
  }
  if (typeof data === 'object') {
    console.log("project object data",data);
    return Object.values(data).some(value => 
      value !== null && 
      value !== undefined && 
      value !== '' && 
      (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
    );
  }
  return data !== null && data !== undefined && data !== '';
};

export default function Resume() {
  const [personalInfo, setPersonalInfo] = useRecoilState(personalInformationState);
  const [socials, setSocials] = useRecoilState(socialsState);
  // const [courses, setCourses] = useRecoilState(coursesState);
  const courses = useRecoilValue(coursesState);
  const setCourses = useSetRecoilState(coursesState);

  const [education, setEducation] = useRecoilState(educationState);
  const [experience, setExperience] = useRecoilState(experienceState);
  const [publications, setPublications] = useRecoilState(publicationsState);
  const [skills, setSkills] = useRecoilState(skillsState);
  const [personalProjects, setPersonalProjects] = useRecoilState(personalProjectsState);
  const [awardsAndAchievements, setAwardsAndAchievements] = useRecoilState(awardsAndAchievementsState);
  const [positionsOfResponsibility, setPositionsOfResponsibility] = useRecoilState(positionsOfResponsibilityState);
  const [competitions, setCompetitions] = useRecoilState(competitionsState);
  const [extracurricularActivities, setExtracurricularActivities] = useRecoilState(extracurricularActivitiesState);

  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();
  var { fetchUserInfo, userInfo } = useAuth();
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [isSubmitted, setIsSubmitted] = useRecoilState(isSubmittedState);
  const [isParsedResume, setIsParsedResume] = useRecoilState(isParsedResumeState);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUserInfoAndProfile = useCallback(async () => {
    if (hasFetched) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await fetchUserInfo(token);
      if (userInfo && userInfo._id) {
        const response = await axios.get(`http://localhost:3004/api/user-profile/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update states with fetched data
        setPersonalInfo(prevState => ({ ...prevState, ...response.data.personal_information }));
        setSocials(prevState => ({ ...prevState, ...response.data.socials }));
        setEducation(response.data.education || []);
        setExperience(response.data.experience || []);
        setPublications(response.data.publications || []);
        setSkills(response.data.skills || []);
        setPersonalProjects(response.data.personal_projects || []);
        setAwardsAndAchievements(response.data.awards_and_achievements || []);
        setPositionsOfResponsibility(response.data.position_of_responsibility || []);
        setCompetitions(response.data.competitions || []);
        setExtracurricularActivities(response.data.extra_curricular_activities || []);

        setProfileExists(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('User profile not found. New user can create their profile.');
      } else {
        console.error('Error fetching user info or profile:', error);
        toast.error('Failed to fetch user information or profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [setPersonalInfo, setSocials, setEducation, setExperience, setPublications, setSkills, setPersonalProjects, setAwardsAndAchievements, setPositionsOfResponsibility, setCompetitions, setExtracurricularActivities]);

  useEffect(() => {
    fetchUserInfoAndProfile();
  }, [fetchUserInfoAndProfile, hasFetched]);

  useEffect(() => {
    if (isParsedResume) {
      toast.success("we worked our magic and parsed your resume", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsParsedResume(false);
    }
  }, [isParsedResume, setIsParsedResume]);

  // New function to check for changes
  const checkForChanges = useCallback(() => {
    // Compare current state with initial state
    const hasChanges = 
      JSON.stringify(personalInfo) !== JSON.stringify(personalInformationState.default) ||
      JSON.stringify(socials) !== JSON.stringify(socialsState.default) ||
      JSON.stringify(courses) !== JSON.stringify(coursesState.default) ||
      JSON.stringify(education) !== JSON.stringify(educationState.default) ||
      JSON.stringify(experience) !== JSON.stringify(experienceState.default) ||
      JSON.stringify(publications) !== JSON.stringify(publicationsState.default) ||
      JSON.stringify(skills) !== JSON.stringify(skillsState.default) ||
      JSON.stringify(personalProjects) !== JSON.stringify(personalProjectsState.default) ||
      JSON.stringify(awardsAndAchievements) !== JSON.stringify(awardsAndAchievementsState.default) ||
      JSON.stringify(positionsOfResponsibility) !== JSON.stringify(positionsOfResponsibilityState.default) ||
      JSON.stringify(competitions) !== JSON.stringify(competitionsState.default) ||
      JSON.stringify(extracurricularActivities) !== JSON.stringify(extracurricularActivitiesState.default) ||
      false;

    setHasLocalChanges(hasChanges);
  }, [personalInfo, socials, courses, education, experience, publications, skills, personalProjects, awardsAndAchievements, positionsOfResponsibility, competitions, extracurricularActivities]);

  useEffect(() => {
    checkForChanges();
  }, [personalInfo, socials, courses, education, experience, publications, skills, personalProjects, awardsAndAchievements, positionsOfResponsibility, competitions, extracurricularActivities, checkForChanges]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !userInfo || !userInfo._id) {
      toast.error('You must be logged in to submit your profile.');
      navigate("/login");
      return;
    }
    try {
      const dataToSubmit = {
        userId: userInfo._id,
        personal_information: {
          ...personalInfo,
          email: userInfo.email
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
        extra_curricular_activities: extracurricularActivities
      };

      console.log('Data being submitted:', JSON.stringify(dataToSubmit, null, 2));

      // First, check if a profile exists
      try {
        const checkResponse = await axios.get(`http://localhost:3004/api/user-profile/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (checkResponse.data) {
          // Profile exists, update it
          const updateResponse = await axios.put(`http://localhost:3004/api/user-profile/${userInfo._id}`, dataToSubmit, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Profile updated successfully:', updateResponse.data);
        }
      } catch (checkError) {
        if (checkError.response && checkError.response.status === 404) {
          // Profile doesn't exist, create a new one
          const createResponse = await axios.post('http://localhost:3004/api/user-profile/create', dataToSubmit, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('New profile created successfully:', createResponse.data);
        } else {
          // If it's not a 404 error, rethrow the error
          throw checkError;
        }
      }

      toast.success('Profile submitted successfully!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to submit profile: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        toast.error('Failed to submit profile. No response received from server.');
      } else {
        toast.error('Failed to submit profile. Please try again.');
      }
    }
  };

  if (isSubmitted) {
    return <ThankyouCard />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!hasAnyData(personalInfo)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <IconUser className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Resume is Empty</h2>
          <p className="text-gray-600 mb-4">
            Please enter your details in the various sections to build your resume.
          </p>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {isValidData(personalInfo) && (
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {personalInfo?.first_name}{" "}
            {personalInfo?.last_name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
            {personalInfo?.email && (
              <span className="flex items-center">
                <IconMail className="w-4 h-4 mr-1" />
                <span className="break-all">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo?.phone && (
              <span className="flex items-center">
                <IconPhone className="w-4 h-4 mr-1" />
                {personalInfo.phone}
              </span>
            )}
            {socials?.github && (
              <a href={`https://github.com/${socials.github}`} className="flex items-center hover:text-blue-500">
                <IconBrandGithub className="w-4 h-4 mr-1" />
                <span className="break-all">{socials.github}</span>
              </a>
            )}
            {socials?.linkedin && (
              <a href={`https://linkedin.com/in/${socials.linkedin}`} className="flex items-center hover:text-blue-500">
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
                <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                <span className="text-gray-600">
                  {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                <li>{edu.degree}</li>
                {edu.cgpa_or_percentage && <li>CGPA/Percentage: {edu.cgpa_or_percentage}</li>}
                {edu.description && <li>{edu.description}</li>}
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
                <h3 className="font-semibold text-gray-800">{exp.position} - {exp.company}</h3>
                <span className="text-gray-600">
                  {exp.start_date && new Date(exp.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })} -
                  {exp.currently_working
                    ? " Present"
                    : exp.end_date && new Date(exp.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(exp.description) 
                  ? exp.description.map((item, idx) => <li key={idx}>{item}</li>)
                  : <li>{exp.description}</li>
                }
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {isValidProject(personalProjects) && <Section
        title="Projects"
        icon={<Rocket className="w-5 h-5" />}
        isEmpty={!isValidData(personalProjects)}
      >
        <div className="space-y-4">
          {personalProjects?.filter(isValidData).map((project, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{project.name}</h3>
                <span className="text-gray-600">
                  {project.start_date && new Date(project.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              {project.link && (
                <a href={project.link} className="text-blue-500 hover:underline block mb-1 break-all">{project.link}</a>
              )}
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(project.description)
                  ? project.description.map((item, idx) => <li key={idx}>{item}</li>)
                  : typeof project.description === 'string'
                    ? project.description.split("\n").map((item, idx) => <li key={idx}>{item}</li>)
                    : project.description
                      ? <li>{String(project.description)}</li>
                      : null
                }
              </ul>
            </div>
          ))}
        </div>
      </Section>}

      <Section
        title="Positions of Responsibility"
        icon={<IconAward className="w-5 h-5" />}
        isEmpty={!isValidData(positionsOfResponsibility)}
      >
        <div className="space-y-4">
          {positionsOfResponsibility?.filter(isValidData).map((position, index) => (
            <div key={position.id || index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{position.title} - {position.organization}</h3>
                <span className="text-gray-600">
                  {position.start_date && new Date(position.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -
                  {position.end_date ? new Date(position.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : 'Present'}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {position.description?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
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
                <h3 className="font-semibold text-gray-800">{competition.name}</h3>
                <span className="text-gray-600">
                  {competition.date && new Date(competition.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(competition.description) 
                  ? competition.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  : competition.description?.split('\n').map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                }
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
                <a href={publication.link} className="ml-1 text-blue-500 hover:underline">[Link]</a>
              )}
              <span className="ml-1 text-gray-600">
                {publication.date && `(${new Date(publication.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})`}
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
              {course.course_provider && <span className="text-gray-600"> - {course.course_provider}</span>}
              <span className="ml-1 text-gray-600">
                {course.completion_date && `(Completed: ${new Date(course.completion_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})`}
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
            <li key={index} className="text-gray-700">{award}</li>
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
            <li key={index} className="text-gray-700">{activity}</li>
          ))}
        </ul>
      </Section>

      {hasAnyData(personalInfo) && (
        <div className="mt-8 text-center">
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
            onClick={handleSubmit}
          >
            Submit Profile
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        <ResumePage content={content} />
      </div>
    </div>
  );
}