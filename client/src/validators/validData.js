export const isValidData = (data) => {
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
  
export const hasAnyData = (profile) => {
    if (!profile || typeof profile !== 'object') {
      return false;
    }
    return Object.values(profile).some(isValidData);
  };


export const requiredFields = {
  personal_information: ["first_name", "last_name", "email", "phone", "expected_salary"],
  education: ["institution", "degree", "start_date", "end_date","cgpa_or_percentage"],
  experience: ["company", "position", "start_date", "end_date","currently_working"],
  publications: ["name","date"],
  courses: ["course_name", "course_provider", "completion_date"],
  skills: ["skill_name", "skill_proficiency"],
  personal_projects: ["name", "start_date", "end_date"],
  position_of_responsibility: ["title", "organization", "start_date", "end_date"],
  competitions: ["name", "date"],
};
