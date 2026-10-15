export type LessonMaterial = {
  lesson_id: string;
  youtube_video_id: string;
  video_duration_seconds: number;
  exercise_path: string;
};
export type LessonProgress = {
  lesson_id: string;
  watched_seconds: number;
  video_completed_at: string | null;
  exercise_completed_at: string | null;
};
export type CourseCompletion = { course_id: string; completed_at: string };
export type CourseMembership = { course_id: string; lesson_id: string };
export function lessonState(progress?: LessonProgress) {
  if (progress?.video_completed_at && progress.exercise_completed_at)
    return "completed";
  return progress &&
    (progress.watched_seconds > 0 || progress.exercise_completed_at)
    ? "in-progress"
    : "not-started";
}
export function watchPercent(
  progress: LessonProgress | undefined,
  duration: number,
) {
  return progress?.video_completed_at
    ? 100
    : Math.min(
        100,
        Math.floor(((progress?.watched_seconds ?? 0) / duration) * 100),
      );
}
/** Reject seeks and impossible clock jumps; replaying coverage is deduplicated in PostgreSQL. */
export function watchedInterval(
  previous: number,
  current: number,
  elapsed: number,
  rate: number,
): [number, number] | undefined {
  if (
    ![previous, current, elapsed, rate].every(Number.isFinite) ||
    elapsed <= 0 ||
    elapsed > 4 ||
    rate <= 0 ||
    rate > 2
  )
    return;
  const delta = current - previous,
    from = Math.floor(previous),
    to = Math.floor(current);
  if (
    delta <= 0 ||
    delta > elapsed * rate + 0.75 ||
    to <= from ||
    to - from > 15 ||
    from < 0
  )
    return;
  return [from, to];
}
