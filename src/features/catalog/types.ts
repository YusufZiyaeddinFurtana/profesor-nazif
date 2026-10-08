export type Program = "FRC" | "FLL";

export type Lesson = {
  id: string;
  program: Program;
  group: string;
  topic: string;
  title: string;
  summary: string;
  longDescription: string;
  coverLabel?: string;
  image?: string;
  youtubeVideoId?: string;
};
