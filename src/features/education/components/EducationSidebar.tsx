import { programs } from "../../catalog/types";
import { LessonStatusIcon } from "./LessonStatusIcon";
import { localizeCategory } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import type { CatalogState } from "../../catalog/CatalogProvider";
import { useNavigation } from "../../../app/Navigation";
import { educationPath } from "../../../app/routes";
import type { Lesson, Program } from "../../catalog/types";
import type { EducationCategory } from "../types";
import { categories } from "../data/categories";
import { useLearning } from "../../learning/LearningProvider";
import { lessonState } from "../../learning/types";

export function EducationSidebar({
  program,
  category,
  lessons,
  activeLessonId,
  status,
}: {
  program: Program;
  category?: EducationCategory;
  lessons: Lesson[];
  activeLessonId?: string;
  status: CatalogState;
}) {
  const { locale, t } = useLocale();
  const { navigate } = useNavigation();
  const learning = useLearning();
  return (
    <aside className="education-sidebar" aria-label={t("educationNav")}>
      <nav className="education-programs" aria-label={t("programSelect")}>
        {programs.map((item) => (
          <a
            href={educationPath(item)}
            key={item}
            aria-current={program === item ? "page" : undefined}
          >
            {item}
          </a>
        ))}
      </nav>
      <label className="category-select">
        <span>{t("field")}</span>
        <select
          value={category?.slug ?? ""}
          onChange={(event) =>
            navigate(educationPath(program, event.target.value || undefined))
          }
        >
          <option value="">{t("allFields", { program })}</option>
          {categories
            .filter((item) => item.program === program)
            .map((item) => localizeCategory(item, locale))
            .map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
        </select>
      </label>
      {category ? (
        <>
          <a
            className="sidebar-overview"
            href={educationPath(program, category.slug)}
            aria-current={!activeLessonId ? "page" : undefined}
          >
            {t("aboutCategory", { category: category.title })}
          </a>
          <h2 className="sidebar-title">
            {t("lessons")} <span>{lessons.length}</span>
          </h2>
          {status !== "ready" ? (
            <p className="sidebar-empty">
              {t(
                status === "loading" ? "lessonListLoading" : "lessonListError",
              )}
            </p>
          ) : lessons.length ? (
            <nav aria-label={t("lessonMenu")}>
              <ol className="sidebar-lessons">
                {lessons.map((lesson, index) => (
                  <li key={lesson.id}>
                    <a
                      href={educationPath(program, category.slug, lesson.id)}
                      aria-current={
                        activeLessonId === lesson.id ? "page" : undefined
                      }
                    >
                      <span className="sidebar-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        {lesson.title}
                        <small>
                          {t(
                            learning.materials.some(
                              (m) => m.lesson_id === lesson.id,
                            )
                              ? "videoLesson"
                              : "contentPending",
                          )}
                        </small>
                      </span>
                      <span
                        className="sidebar-progress-state"
                        aria-label={t(
                          learning.status === "loading"
                            ? "progressLoading"
                            : learning.status === "error"
                              ? "progressLoadError"
                              : lessonState(
                                    learning.progress.find(
                                      (p) => p.lesson_id === lesson.id,
                                    ),
                                  ) === "completed"
                                ? "lessonCompleted"
                                : lessonState(
                                      learning.progress.find(
                                        (p) => p.lesson_id === lesson.id,
                                      ),
                                    ) === "in-progress"
                                  ? "lessonInProgress"
                                  : "lessonNotStarted",
                        )}
                      >
                        <LessonStatusIcon
                          state={lessonState(
                            learning.progress.find(
                              (p) => p.lesson_id === lesson.id,
                            ),
                          )}
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <p className="sidebar-empty">{t("noLessons")}</p>
          )}
        </>
      ) : (
        <nav
          className="sidebar-categories"
          aria-label={t("programFields", { program })}
        >
          {categories
            .filter((item) => item.program === program)
            .map((item) => localizeCategory(item, locale))
            .map((item) => (
              <a href={educationPath(program, item.slug)} key={item.slug}>
                {item.title}
              </a>
            ))}
        </nav>
      )}
    </aside>
  );
}
