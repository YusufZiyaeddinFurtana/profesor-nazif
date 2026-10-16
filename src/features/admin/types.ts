export type AdminLesson = {
  id: string;
  course_id: string;
  program: string;
  title: string;
  summary: string;
  long_description: string;
  sort_order: number;
  youtube_video_id: string | null;
  video_duration_seconds: number | null;
  exercise_path: string | null;
  is_published: boolean;
  ever_published: boolean;
  updated_at: string;
};
export type LessonInput = {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  longDescription: string;
  videoId: string | null;
  duration: number | null;
  exercisePath: string | null;
  sortOrder: number;
  publish: boolean;
  expectedUpdatedAt: string | null;
};
