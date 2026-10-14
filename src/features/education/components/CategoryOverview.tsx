import { useLocale } from "../../../i18n/LocaleProvider";
import type { Lesson } from "../../catalog/types";
import type { EducationCategory } from "../types";
import { curricula } from "../data/curricula";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";
export function CategoryOverview({
  category,
  lessons,
}: {
  category: EducationCategory;
  lessons: Lesson[];
}) {
  const { locale, t } = useLocale();
  const curriculum =
    curricula[`${category.program}/${category.slug}`]?.[locale];
  const outcomes =
    curriculum?.outcomes ?? lessons.map((lesson) => lesson.summary);
  return (
    <article className="category-overview">
      <h1>{category.title}</h1>
      <p className="education-lead">{category.description}</p>
      <section className="course-outcomes" aria-labelledby="outcomes-title">
        <div className="outcomes-heading">
          <h2 id="outcomes-title">{t("courseOutcomes")}</h2>
          {outcomes.length > 0 && !curriculum?.reviewed && (
            <span className="draft-label">{t("outcomesDraft")}</span>
          )}
        </div>
        <p>{t("outcomesDescription")}</p>
        {outcomes.length > 0 ? (
          <ul>
            {outcomes.map((outcome, index) => (
              <li key={index}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="curriculum-pending">{t("outcomesPending")}</p>
        )}
      </section>
      {outcomes.length > 0 && (
        <section className="course-application">
          <h2>{t("step3")}</h2>
          <p>{curriculum?.application ?? t("applicationDescription")}</p>
        </section>
      )}
      {lessons.length > 0 ? (
        <div className="course-start">
          <div>
            <strong>
              {t(
                lessons.length === 1
                  ? "courseLessonCountOne"
                  : "courseLessonCount",
                { number: lessons.length },
              )}
            </strong>
            <p>{t("courseNavigationHint")}</p>
          </div>
          <a
            className="primary-button"
            href={educationPath(category.program, category.slug, lessons[0].id)}
          >
            {t("courseStart")}
            <Arrow />
          </a>
        </div>
      ) : (
        <div className="category-empty">
          <h2>{t("lessonsPending")}</h2>
          <p>{t("emptyDescription")}</p>
          <a href={educationPath(category.program)}>
            {t("backProgram", { program: category.program })}
            <Arrow />
          </a>
        </div>
      )}
    </article>
  );
}
