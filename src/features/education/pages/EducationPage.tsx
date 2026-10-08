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
  const { lessons, status, retry } = useCatalog();
  const category = categorySlug
    ? findCategory(program, categorySlug)
    : undefined;
  const categoryLessons = category ? lessonsInCategory(lessons, category) : [];
  const lesson = lessonId
    ? categoryLessons.find((item) => item.id === lessonId)
    : undefined;
  useEffect(() => {
    document.title = `${lesson?.title ?? category?.title ?? `${program} eğitimleri`} — Profesör Nazif`;
  }, [lesson?.title, category?.title, program]);
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
          <nav className="education-breadcrumbs" aria-label="Sayfa yolu">
            <a href="/#kategoriler">Eğitimler</a>
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
                  Ders {categoryLessons.indexOf(lesson) + 1}
                </span>
              </>
            )}
          </nav>
          {!category ? (
            <ProgramOverview program={program} />
          ) : status !== "ready" ? (
            <CatalogStatus status={status} retry={retry} />
          ) : lesson ? (
            <LessonContent key={lesson.id} lesson={lesson} />
          ) : (
            <CategoryOverview category={category} lessons={categoryLessons} />
          )}
        </div>
      </div>
    </div>
  );
}
