import { supabase } from "../../lib/supabase";
import type {
  CourseCompletion,
  CourseMembership,
  LessonMaterial,
  LessonProgress,
} from "./types";
const progressColumns =
  "lesson_id,watched_seconds,video_completed_at,exercise_completed_at";
function client() {
  if (!supabase) throw new Error("Sign in required");
  return supabase;
}
export async function loadLearning(userId: string, signal: AbortSignal) {
  const c = client();
  const results = await Promise.all([
    c
      .from("lesson_materials")
      .select("lesson_id,youtube_video_id,video_duration_seconds,exercise_path")
      .abortSignal(signal),
    c.from("course_lessons").select("course_id,lesson_id").abortSignal(signal),
    c
      .from("lesson_progress")
      .select(progressColumns)
      .eq("user_id", userId)
      .abortSignal(signal),
    c
      .from("course_completions")
      .select("course_id,completed_at")
      .eq("user_id", userId)
      .abortSignal(signal),
  ]);
  for (const result of results) if (result.error) throw result.error;
  return {
    materials: results[0].data as LessonMaterial[],
    memberships: results[1].data as CourseMembership[],
    progress: results[2].data as LessonProgress[],
    completions: results[3].data as CourseCompletion[],
  };
}
export async function recordWatch(lessonId: string, from: number, to: number) {
  const { data, error } = await client().rpc("record_lesson_watch", {
    p_lesson_id: lessonId,
    p_from: from,
    p_to: to,
  });
  if (error) throw error;
  return data as LessonProgress;
}
export async function completeExercise(lessonId: string) {
  const { data, error } = await client().rpc("complete_lesson_exercise", {
    p_lesson_id: lessonId,
  });
  if (error) throw error;
  return data as LessonProgress;
}
export async function loadCompletions(userId: string) {
  const { data, error } = await client()
    .from("course_completions")
    .select("course_id,completed_at")
    .eq("user_id", userId);
  if (error) throw error;
  return data as CourseCompletion[];
}
export async function exerciseDownload(path: string) {
  const { data, error } = await client()
    .storage.from("lesson-exercises")
    .createSignedUrl(path, 60, { download: true });
  if (error) throw error;
  return data.signedUrl;
}
