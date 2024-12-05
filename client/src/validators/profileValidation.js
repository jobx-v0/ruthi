import { personalInfoSchema, socialsSchema, educationSchema, experienceSchema, courseSchema, projectSchema, awardSchema, activitySchema, competitionSchema, positionSchema } from './ZodSchema'; 

export const validateSectionData = (sectionName, data, schema) => {
  const errors = [];

  if (!data || (Array.isArray(data) && data.length === 0)) {
    if (sectionName === 'personal_information' || sectionName === 'socials') {
      return { sectionName, errors: [`No data provided for ${sectionName}`] };
    }
    return { sectionName, errors: [] };
  }

  // If the section has multiple entries (e.g., experience, education)
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const result = schema.safeParse(item);

      if (!result.success) {
        result.error.errors.forEach((error) => {
          errors.push({
            field: error.path.join('.'),
            message: error.message,
            isValid: false,
            index, // Use index to identify which array item failed
          });
        });
      }
    });
  } else {
    // Single object validation (e.g., personal_information)
    const result = schema.safeParse(data);

    if (!result.success) {
      result.error.errors.forEach((error) => {
        errors.push({
          field: error.path.join('.'),
          message: error.message,
          isValid: false,
        });
      });
    }
  }

  return { sectionName, errors };
};

// Main function to validate all sections
export const validateProfile = (data) => {
  const validations = [
    validateSectionData(
      'personal_information',
      data.personal_information,
      personalInfoSchema
    ),
    validateSectionData('socials', data.socials, socialsSchema),
    validateSectionData('education', data.education, educationSchema),
    validateSectionData('experience', data.experience, experienceSchema),
    validateSectionData('courses', data.courses, courseSchema),
    validateSectionData(
      'personal_projects',
      data.personal_projects,
      projectSchema
    ),
    validateSectionData(
      'awards_and_achievements',
      data.awards_and_achievements,
      awardSchema
    ),
    validateSectionData(
      'extra_curricular_activities',
      data.extra_curricular_activities,
      activitySchema
    ),
    validateSectionData('competitions', data.competitions, competitionSchema),
    validateSectionData(
      'position_of_responsibility',
      data.position_of_responsibility,
      positionSchema
    ),
  ];

  return validations.filter((result) => result.errors.length > 0); // Only return sections with errors
};
