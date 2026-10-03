import { useEffect, useState } from "react";
import { useCatalog } from "../features/catalog/CatalogProvider";
import { CatalogStatus } from "../components/lessons/CatalogStatus";
import { ChalkNazifArtwork } from "../components/branding/ChalkNazifArtwork";
import { YouTubePlayer } from "../components/lessons/YouTubePlayer";
import { Arrow } from "../components/ui/Arrow";
import { NotFoundPage } from "./NotFoundPage";

export function LessonPage({ id }: { id: string }) {
  const { lessons, status, retry } = useCatalog();
  const [introCycle, setIntroCycle] = useState(0);
  const lesson = lessons.find((item) => item.id === id);
  useEffect(() => {
    document.title = lesson
      ? `${lesson.title} — Profesör Nazif`
      : "Ders — Profesör Nazif";
  }, [lesson]);
  if (status !== "ready")
    return (
      <section className="section-wrap route-status">
        <CatalogStatus status={status} retry={retry} />
      </section>
    );
  if (!lesson) return <NotFoundPage />;
  return (
    <section className="detail-section" aria-labelledby="detail-title">
      <div className="section-wrap detail-layout">
        <div className="detail-head">
          <span>
            {lesson.program} / {lesson.group} / {lesson.topic}
          </span>
          <a href="/#dersler">
            Derslere dön <Arrow />
          </a>
        </div>
        <div className="detail-copy">
          {!lesson.youtubeVideoId && (
            <span className="draft-stamp">DERS TASLAĞI</span>
          )}
          <h1 id="detail-title">{lesson.title}</h1>
          <p className="detail-summary">{lesson.summary}</p>
          <h2>Bu derste neler var?</h2>
          <p>{lesson.longDescription}</p>
        </div>
        <div className="detail-media">
          <div className="intro-preview" key={introCycle}>
            <ChalkNazifArtwork animated />
            <span>{lesson.title}</span>
          </div>
          <button
            type="button"
            onClick={() => setIntroCycle((value) => value + 1)}
          >
            Tebeşir açılışını yeniden izle <Arrow />
          </button>
          <YouTubePlayer key={lesson.id} lesson={lesson} />
        </div>
      </div>
    </section>
  );
}
