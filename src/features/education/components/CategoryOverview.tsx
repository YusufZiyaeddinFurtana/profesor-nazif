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
  return (
    <article className="category-overview">
      <h1>{category.title}</h1>
      <p className="education-lead">{category.description}</p>
      <div className="category-note">
        <h2>Bu alanda nasıl ilerlersin?</h2>
        <p>
          Soldaki ders menüsünden bir konu seç. Nazif’in tebeşir açılışıyla
          başla, ardından dersin açıklamasını ve videosunu takip et.
        </p>
      </div>
      {lessons.length ? (
        <>
          <a
            className="primary-button"
            href={educationPath(category.program, category.slug, lessons[0].id)}
          >
            İlk dersi aç <Arrow />
          </a>
          <section
            className="category-curriculum"
            aria-labelledby="curriculum-title"
          >
            <h2 id="curriculum-title">Bu alandaki dersler</h2>
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
          <h2>Dersler hazırlanıyor.</h2>
          <p>
            Bu alanın dersleri eklendiğinde burada ve soldaki menüde görünecek.
            Şimdilik diğer eğitim alanlarına göz atabilirsin.
          </p>
          <a href={educationPath(category.program)}>
            {category.program} eğitimlerine dön <Arrow />
          </a>
        </div>
      )}
    </article>
  );
}
