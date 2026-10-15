import { useLocale } from "../../../i18n/LocaleProvider";
import type { Lesson } from "../../catalog/types";
import { LessonIntro } from "./LessonIntro";
import { LessonVideo } from "./LessonVideo";
import { useAuth } from "../../auth/AuthProvider";
import { useLearning } from "../../learning/LearningProvider";
import { LessonExercise } from "../../learning/components/LessonExercise";
import { AuthAvailability } from "../../auth/components/AuthAvailability";
import { loginPath } from "../../auth/authHelpers";
import { CourseProgress } from "../../learning/components/CourseProgress";

export function LessonContent({
  lesson,
  courseId,
}: {
  lesson: Lesson;
  courseId: string;
}) {
  const { t } = useLocale();
  const { session } = useAuth();
  const learning = useLearning();
  return (
    <article className="lesson-content">
      <header className="lesson-heading">
        <h1>{lesson.title}</h1>
        <p className="education-lead">{lesson.summary}</p>
      </header>
      <LessonIntro title={lesson.title} />
      <AuthAvailability>
        {session ? (
          <>
            <LessonVideo
              key={`${session.user.id}/${lesson.id}`}
              lesson={lesson}
            />
            {learning.status === "ready" && (
              <LessonExercise
                key={lesson.id}
                material={learning.materials.find(
                  (m) => m.lesson_id === lesson.id,
                )}
              />
            )}
            <CourseProgress courseId={courseId} />
          </>
        ) : (
          <div className="learning-gate">
            <h2>{t("studentVideosTitle")}</h2>
            <p>{t("studentVideosDescription")}</p>
            <a
              className="primary-button"
              href={loginPath(window.location.pathname)}
            >
              {t("authLogin")}
            </a>
            <a
              className="text-action"
              href={`/kayit?next=${encodeURIComponent(window.location.pathname)}`}
            >
              {t("authRegister")}
            </a>
          </div>
        )}
      </AuthAvailability>
      <section className="lesson-description">
        <h2>{t("lessonDetails")}</h2>
        <p>{lesson.longDescription}</p>
      </section>
    </article>
  );
}
