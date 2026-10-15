import { useLocale } from "../../../i18n/LocaleProvider";
import type { Lesson } from "../../catalog/types";
import { useLearning } from "../../learning/LearningProvider";
import { TrackedVideo } from "../../learning/components/TrackedVideo";
import { watchPercent } from "../../learning/types";
export function LessonVideo({ lesson }: { lesson: Lesson }) {
  const { t } = useLocale();
  const learning = useLearning();
  const material = learning.materials.find((m) => m.lesson_id === lesson.id);
  const progress = learning.progress.find((p) => p.lesson_id === lesson.id);
  if (learning.status === "loading")
    return <p role="status">{t("progressLoading")}</p>;
  if (learning.status === "error")
    return (
      <div className="learning-notice" role="alert">
        <p>{t("progressLoadError")}</p>
        <button
          type="button"
          className="secondary-button"
          onClick={learning.retry}
        >
          {t("retry")}
        </button>
      </div>
    );
  return (
    <section
      className="lesson-video"
      aria-label={t("lessonVideo", { title: lesson.title })}
    >
      <div className="video-board-frame">
        {material ? (
          <TrackedVideo
            key={material.lesson_id}
            material={material}
            title={lesson.title}
          />
        ) : (
          <div className="video-board-surface">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="29"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m26 21 18 11-18 11V21Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <p>{t("videoPending")}</p>
            <span>{t("videoPlaceholder")}</span>
          </div>
        )}
      </div>
      {material && (
        <p className="video-progress-text">
          {t("videoProgress", {
            percent: watchPercent(progress, material.video_duration_seconds),
          })}
        </p>
      )}
    </section>
  );
}
