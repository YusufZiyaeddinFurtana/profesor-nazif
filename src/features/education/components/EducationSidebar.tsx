import type { CatalogState } from "../../catalog/CatalogProvider";
import { useNavigation } from "../../../app/Navigation";
import { educationPath } from "../../../app/routes";
import type { Lesson, Program } from "../../catalog/types";
import type { EducationCategory } from "../types";
import { categories } from "../data/categories";

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
  const { navigate } = useNavigation();
  return (
    <aside className="education-sidebar" aria-label="Eğitim gezinmesi">
      <nav className="education-programs" aria-label="Program seçimi">
        {(["FRC", "FLL"] as const).map((item) => (
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
        <span>Eğitim alanı</span>
        <select
          value={category?.slug ?? ""}
          onChange={(event) =>
            navigate(educationPath(program, event.target.value || undefined))
          }
        >
          <option value="">Tüm {program} alanları</option>
          {categories
            .filter((item) => item.program === program)
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
            {category.title} hakkında
          </a>
          <h2 className="sidebar-title">
            Dersler <span>{lessons.length}</span>
          </h2>
          {status !== "ready" ? (
            <p className="sidebar-empty">
              {status === "loading"
                ? "Ders listesi açılıyor…"
                : "Ders listesi yüklenemedi."}
            </p>
          ) : lessons.length ? (
            <nav aria-label="Ders menüsü">
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
                          {lesson.youtubeVideoId
                            ? "Video dersi"
                            : "İçerik hazırlanıyor"}
                        </small>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <p className="sidebar-empty">Bu alana henüz ders eklenmedi.</p>
          )}
        </>
      ) : (
        <nav
          className="sidebar-categories"
          aria-label={`${program} eğitim alanları`}
        >
          {categories
            .filter((item) => item.program === program)
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
