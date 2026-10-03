import { useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { HomePage } from "../pages/HomePage";
import { LessonPage } from "../pages/LessonPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { useNavigation } from "./Navigation";

export default function App() {
  const { location } = useNavigation();
  const match = /^\/ders\/([^/]+)\/?$/.exec(location.pathname);
  let lessonId: string | undefined;
  try {
    lessonId = match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    /* Invalid paths show 404. */
  }
  useEffect(() => {
    if (location.pathname === "/")
      document.title = "Profesör Nazif — Tahtada öğren, robotunda dene.";
    else if (!match) document.title = "Sayfa bulunamadı — Profesör Nazif";
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {location.pathname === "/" ? (
          <HomePage />
        ) : lessonId ? (
          <LessonPage key={lessonId} id={lessonId} />
        ) : (
          <NotFoundPage />
        )}
      </main>
      <Footer />
    </>
  );
}
