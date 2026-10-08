import { useLocale } from "../../../i18n/LocaleProvider";
import type { Lesson } from "../../catalog/types";
import type { EducationCategory } from "../types";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";

export function CategoryOverview({
  category,
  lessons,
}: {
  category: EducationCategory;
  lessons: Lesson[];
}) {
  const { t } = useLocale();
  return (
    <article className="category-overview">
      <h1>{category.title}</h1>
      <p className="education-lead">{category.description}</p>
      <div className="category-note">
        <h2>{t("progressTitle")}</h2>
        <p>{t("progressDescription")}</p>
      </div>
      {lessons.length ? (
        <>
          <a
            className="primary-button"
            href={educationPath(category.program, category.slug, lessons[0].id)}
          >
            {t("firstLesson")} <Arrow />
          </a>
          <section
            className="category-curriculum"
            aria-labelledby="curriculum-title"
          >
            <h2 id="curriculum-title">{t("fieldLessons")}</h2>
            <ol>
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <a
                    href={educationPath(
                      category.program,
                      category.slug,
                      lesson.id,
                    )}
                  >
                    <strong>{lesson.title}</strong>
                    <span>{lesson.summary}</span>
                    <Arrow diagonal />
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <div className="category-empty">
          <h2>{t("lessonsPending")}</h2>
          <p>{t("emptyDescription")}</p>
          <a href={educationPath(category.program)}>
            {t("backProgram", { program: category.program })} <Arrow />
          </a>
        </div>
      )}
    </article>
  );
}
