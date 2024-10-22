import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  expected_salary: z
    .number()
    .min(1, "Expected salary must be at least 1")
    .max(99, "Expected salary must not exceed 99")
    .or(
      z
        .string()
        .regex(/^[1-9][0-9]?$/, "Expected salary must be between 1 and 99")
    ),
});

// Socials Schema
export const socialsSchema = z.object({
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Education Schema
export const educationSchema = z.object({
  institution: z
    .string()
    .min(1, "Institution is required")
    .regex(
      /^[a-zA-Z\s.,'-]+$/,
      "Institution should only contain letters, spaces, and common punctuation"
    ),
  degree: z
    .string()
    .min(1, "Degree is required")
    .regex(
      /^[a-zA-Z\s.,'-]+$/,
      "Degree should only contain letters, spaces, and common punctuation"
    ),
  start_date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      const seventyYearsAgo = new Date(
        today.getFullYear() - 70,
        today.getMonth()
      );
      return selectedDate >= seventyYearsAgo && selectedDate <= today;
    },
    {
      message:
        "Start date must be within the last 70 years and not in the future",
    }
  ),
  end_date: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty string for ongoing education
        const [year, month] = date.split("-");
        const selectedDate = new Date(year, month - 1);
        const today = new Date();
        return selectedDate <= today;
      },
      { message: "End date cannot be in the future" }
    )
    .optional(),
  cgpa_or_percentage: z
    .union([
      z.number(),
      z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "Invalid CGPA or percentage"),
    ])
    .optional(),
  description: z.string().optional().or(z.literal("")),
});

// Course Schema
export const courseSchema = z.object({
  course_name: z
    .string()
    .min(1, "Course name is required")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'-]+$/,
      "Course name must contain at least one letter and can include letters, numbers, spaces, and common punctuation"
    ),
  course_provider: z
    .string()
    .min(1, "Course provider is required")
    .regex(
      /^[a-zA-Z\s.,'-]+$/,
      "Course provider should only contain letters, spaces, and common punctuation"
    ),
  completion_date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      const seventyYearsAgo = new Date(
        today.getFullYear() - 70,
        today.getMonth()
      );
      return selectedDate >= seventyYearsAgo && selectedDate <= today;
    },
    {
      message:
        "Completion date must be within the last 70 years and not in the future",
    }
  ),
  course_link: z.string().url("Invalid URL").or(z.literal("")),
});

// Experience Schema
export const experienceSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'-]+$/,
      "Company name must contain at least one letter and can include letters, numbers, spaces, and common punctuation"
    ),
  position: z
    .string()
    .min(1, "Position is required")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'-]+$/,
      "Position should contain at least one letter and can only include letters, numbers, spaces, and common punctuation"
    ),

  start_date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      const seventyYearsAgo = new Date(
        today.getFullYear() - 70,
        today.getMonth()
      );
      return selectedDate >= seventyYearsAgo && selectedDate <= today;
    },
    {
      message:
        "Start date must be within the last 70 years and not in the future",
    }
  ),
  end_date: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty string for currently working
        const [year, month] = date.split("-");
        const selectedDate = new Date(year, month - 1);
        const today = new Date();
        return selectedDate <= today;
      },
      { message: "End date cannot be in the future" }
    )
    .optional(),
  description: z.string().optional().or(z.literal("")),
  currently_working: z.boolean().optional(),
});

// Personal Projects Schema
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .regex(/^(?=.*[a-zA-Z])/, "Project name must contain at least one letter"),
  description: z.string().optional(),
  link: z.string().url("Invalid URL").or(z.literal("")),
  start_date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Start date cannot be in the future" }
  ),
  end_date: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty string for ongoing projects
        const [year, month] = date.split("-");
        const selectedDate = new Date(year, month - 1);
        const today = new Date();
        return selectedDate <= today;
      },
      { message: "End date cannot be in the future" }
    )
    .optional(),
});

// Award Schema
export const awardSchema = z
  .string()
  .min(1, "Award name is required")
  .regex(/^(?=.*[a-zA-Z])/, "Award name must contain at least one letter")
  .max(100, "Award name must be 100 characters or less");

// Extra Curricular Activities Schema
export const activitySchema = z
  .string()
  .min(1, "Activity name is required")
  .regex(/^(?=.*[a-zA-Z])/, "Activity name must contain at least one letter")
  .max(100, "Activity name must be 100 characters or less");

// Competition Schema
export const competitionSchema = z.object({
  name: z
    .string()
    .min(1, "Competition name is required")
    .regex(
      /^(?=.*[a-zA-Z])/,
      "Competition name must contain at least one letter"
    ),
  description: z.string().optional(),
  date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Competition date cannot be in the future" }
  ),
});

// Publication Schema
export const publicationSchema = z.object({
  name: z
    .string()
    .min(1, "Publication name is required")
    .regex(
      /^(?=.*[a-zA-Z])/,
      "Publication name must contain at least one letter"
    ),
  link: z.string().url("Invalid URL").or(z.literal("")),
  date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Publication date cannot be in the future" }
  ),
});

// Position of Responsibility Schema
export const positionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .regex(/^(?=.*[a-zA-Z])/, "Title must contain at least one letter"),
  organization: z
    .string()
    .min(1, "Organization is required")
    .regex(/^(?=.*[a-zA-Z])/, "Organization must contain at least one letter"),
  start_date: z.string().refine(
    (date) => {
      const [year, month] = date.split("-");
      const selectedDate = new Date(year, month - 1);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Start date cannot be in the future" }
  ),
  end_date: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty string for ongoing positions
        const [year, month] = date.split("-");
        const selectedDate = new Date(year, month - 1);
        const today = new Date();
        return selectedDate <= today;
      },
      { message: "End date cannot be in the future" }
    )
    .optional(),
  description: z.string().optional(),
});
