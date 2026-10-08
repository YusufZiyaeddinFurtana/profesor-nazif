import type { Locale, LessonTranslation } from "../../i18n/types";
export type Program = "FRC" | "FLL";

export type Lesson = {
  id: string;
  program: Program;
  group: string;
  topic: string;
  title: string;
  summary: string;
  longDescription: string;
  translations?: Partial<Record<Locale, LessonTranslation>>;
  coverLabel?: string;
  image?: string;
  youtubeVideoId?: string;
};
