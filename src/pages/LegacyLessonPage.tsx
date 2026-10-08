import { useEffect } from "react";
import { useNavigation } from "../app/Navigation";
import { educationPath } from "../app/routes";
import { useCatalog } from "../features/catalog/CatalogProvider";
import { getCategoryForLesson } from "../features/education/data/categories";
import { CatalogStatus } from "../features/catalog/components/CatalogStatus";
import { NotFoundPage } from "./NotFoundPage";

/** Keep previously shared /ders/:id links usable after moving to category routes. */
export function LegacyLessonPage({ id }: { id: string }) {
  const { lessons, status, retry } = useCatalog();
  const { navigate } = useNavigation();
  const lesson = lessons.find((item) => item.id === id);
  const category = lesson ? getCategoryForLesson(lesson) : undefined;
  useEffect(() => {
    if (lesson && category)
      navigate(educationPath(category.program, category.slug, lesson.id), true);
  }, [lesson, category, navigate]);
  if (status !== "ready")
    return (
      <section className="section-wrap route-status">
        <CatalogStatus status={status} retry={retry} />
      </section>
    );
  if (!lesson || !category) return <NotFoundPage />;
  return (
    <p className="section-wrap catalog-status" role="status">
      Ders açılıyor…
    </p>
  );
}
