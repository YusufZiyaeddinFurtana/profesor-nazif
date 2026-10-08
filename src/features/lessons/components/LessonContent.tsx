import { useLocale } from "../../../i18n/LocaleProvider";
import type { Lesson } from "../../catalog/types";
import { LessonIntro } from "./LessonIntro";
import { LessonVideo } from "./LessonVideo";

export function LessonContent({ lesson }: { lesson: Lesson }) {
  const { t } = useLocale();
  return (
    <article className="lesson-content">
      <header className="lesson-heading">
        <h1>{lesson.title}</h1>
        <p className="education-lead">{lesson.summary}</p>
      </header>
      <LessonIntro title={lesson.title} />
      <LessonVideo title={lesson.title} />
      <section className="lesson-description">
        <h2>{t("lessonDetails")}</h2>
        <p>{lesson.longDescription}</p>
      </section>
    </article>
  );
}
