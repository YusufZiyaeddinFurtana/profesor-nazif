import { InstructorsPage } from "../features/instructors/pages/InstructorsPage";
import { BookingPage } from "../features/booking/pages/BookingPage";
import { useLocale } from "../i18n/LocaleProvider";
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
  const { t } = useLocale();
  const { location } = useNavigation();
  const route = resolveRoute(location.pathname);
  useEffect(() => {
    if (route.kind === "home") document.title = t("homeTitle");
    else if (route.kind === "not-found")
      document.title = `${t("notFoundTitle")} — ${t("brand")}`;
  }, [route.kind, t]);
  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {route.kind === "home" ? (
          <HomePage />
        ) : route.kind === "instructors" ? (
          <InstructorsPage instructorId={route.instructorId} />
        ) : route.kind === "booking" ? (
          <BookingPage />
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
