import type { Program } from "../catalog/types";

export type EducationCategory = {
  slug: string;
  program: Program;
  title: string;
  description: string;
  group: string;
  topic?: string;
};

export type CourseGroup = {
  id: string;
  program: Program;
  categorySlug: string;
  title: string;
  description: string;
};
