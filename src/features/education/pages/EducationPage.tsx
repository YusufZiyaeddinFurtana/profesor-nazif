import { localizeLesson } from "../../../i18n/content/lessons";
import { localizeCategory } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useEffect } from "react";
import type { Program } from "../../catalog/types";
import { useCatalog } from "../../catalog/CatalogProvider";
import { CatalogStatus } from "../../catalog/components/CatalogStatus";
import { NotFoundPage } from "../../../pages/NotFoundPage";
import { LessonContent } from "../../lessons/components/LessonContent";
import { EducationSidebar } from "../components/EducationSidebar";
import { CategoryOverview } from "../components/CategoryOverview";
import { ProgramOverview } from "../components/ProgramOverview";
import { findCategory, lessonsInCategory } from "../data/categories";
import { educationPath } from "../../../app/routes";

export function EducationPage({
  program,
  categorySlug,
  lessonId,
}: {
  program: Program;
  categorySlug?: string;
  lessonId?: string;
}) {
  const { locale, t } = useLocale();
  const { lessons, status, retry } = useCatalog();
  const sourceCategory = categorySlug
    ? findCategory(program, categorySlug)
    : undefined;
  const category = sourceCategory
    ? localizeCategory(sourceCategory, locale)
    : undefined;
  const categoryLessons = category
    ? lessonsInCategory(lessons, category).map((item) =>
        localizeLesson(item, locale),
      )
    : [];
  const lesson = lessonId
    ? categoryLessons.find((item) => item.id === lessonId)
    : undefined;
  const invalidRoute = Boolean(
    (categorySlug && !category) || (status === "ready" && lessonId && !lesson),
  );
  useEffect(() => {
    if (invalidRoute) {
      document.title = `${t("notFoundTitle")} — ${t("brand")}`;
      return;
    }
    document.title = `${lesson?.title ?? category?.title ?? t("programCourses", { program })} — ${t("brand")}`;
  }, [lesson?.title, category?.title, program, t, invalidRoute]);
  if (categorySlug && !category) return <NotFoundPage />;
  if (status === "ready" && lessonId && !lesson) return <NotFoundPage />;
  return (
    <div className="education-page">
      <div className="education-layout section-wrap">
        <EducationSidebar
          program={program}
          category={category}
          lessons={categoryLessons}
          activeLessonId={lessonId}
          status={status}
        />
        <div className="education-main">
          <nav className="education-breadcrumbs" aria-label={t("breadcrumb")}>
            <a href="/#kategoriler">{t("courses")}</a>
            <span aria-hidden="true">/</span>
            <a href={educationPath(program)}>{program}</a>
            {category && (
              <>
                <span aria-hidden="true">/</span>
                <a
                  href={educationPath(program, category.slug)}
                  aria-current={!lessonId ? "page" : undefined}
                >
                  {category.title}
                </a>
              </>
            )}
            {lesson && (
              <>
                <span aria-hidden="true">/</span>
                <span aria-current="page">
                  {t("lessonNumber", {
                    number: categoryLessons.indexOf(lesson) + 1,
                  })}
                </span>
              </>
            )}
          </nav>
          {!category ? (
            <ProgramOverview program={program} />
          ) : status !== "ready" ? (
            <CatalogStatus status={status} retry={retry} />
          ) : lesson ? (
            <LessonContent
              key={lesson.id}
              lesson={lesson}
              courseId={`${program.toLowerCase()}/${category.slug}`}
            />
          ) : (
            <CategoryOverview category={category} lessons={categoryLessons} />
          )}
        </div>
      </div>
    </div>
  );
}
