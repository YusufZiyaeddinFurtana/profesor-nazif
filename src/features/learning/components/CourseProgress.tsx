import { useLocale } from "../../../i18n/LocaleProvider";
import { useAuth } from "../../auth/AuthProvider";
import { useLearning } from "../LearningProvider";
export function CourseProgress({ courseId }: { courseId: string }) {
  const { t } = useLocale();
  const { session } = useAuth();
  const { materials, memberships, progress, completions, status, retry } =
    useLearning();
  if (!session) return null;
  if (status === "loading") return <p role="status">{t("progressLoading")}</p>;
  if (status === "error")
    return (
      <div className="learning-notice" role="alert">
        <p>{t("progressLoadError")}</p>
        <button type="button" className="secondary-button" onClick={retry}>
          {t("retry")}
        </button>
      </div>
    );
  const ids = memberships
    .filter((m) => m.course_id === courseId)
    .map((m) => m.lesson_id);
  const lessons = materials.filter((m) => ids.includes(m.lesson_id));
  if (!lessons.length) return null;
  if (lessons.length !== ids.length)
    return <p className="curriculum-pending">{t("courseProgressPending")}</p>;
  const complete = completions.some((c) => c.course_id === courseId);
  const duration = lessons.reduce(
    (sum, m) => sum + m.video_duration_seconds,
    0,
  );
  const watched = lessons.reduce(
    (sum, m) =>
      sum +
      Math.min(
        m.video_duration_seconds,
        progress.find((p) => p.lesson_id === m.lesson_id)?.watched_seconds ?? 0,
      ),
    0,
  );
  const exercises = lessons.filter(
    (m) =>
      progress.find((p) => p.lesson_id === m.lesson_id)?.exercise_completed_at,
  ).length;
  const percent = complete
    ? 100
    : Math.min(100, Math.floor((watched / duration) * 100));
  return (
    <section className="course-progress" aria-label={t("courseProgress")}>
      <div className="progress-heading">
        <h2>{t("courseProgress")}</h2>
        <strong>{percent}%</strong>
      </div>
      <progress value={percent} max="100" aria-label={t("courseProgress")} />
      <p>{t("courseExercises", { done: exercises, total: lessons.length })}</p>
      {complete && (
        <div className="completion-notice" role="status">
          <h3>{t("courseCompleted")}</h3>
          <p>{t("certificateQueued")}</p>
        </div>
      )}
    </section>
  );
}
