import { useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { HomePage } from "../features/home/pages/HomePage";
import { EducationPage } from "../features/education/pages/EducationPage";
import { LegacyLessonPage } from "../pages/LegacyLessonPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { useNavigation } from "./Navigation";
import { resolveRoute } from "./routes";

export default function App() {
  const { location } = useNavigation();
  const route = resolveRoute(location.pathname);
  useEffect(() => {
    if (route.kind === "home")
      document.title = "Profesör Nazif — Tahtada öğren, robotunda dene.";
    else if (route.kind === "not-found")
      document.title = "Sayfa bulunamadı — Profesör Nazif";
  }, [route.kind]);
  return (
    <>
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {route.kind === "home" ? (
          <HomePage />
        ) : route.kind === "education" ? (
          <EducationPage
            program={route.program}
            categorySlug={route.categorySlug}
            lessonId={route.lessonId}
          />
        ) : route.kind === "legacy-lesson" ? (
          <LegacyLessonPage id={route.lessonId} />
        ) : (
          <NotFoundPage />
        )}
      </main>
      <Footer />
    </>
  );
}
