import { useMemo } from "react";
import { useCatalog } from "../../features/catalog/CatalogProvider";
import { useCatalogFilters } from "../../features/catalog/useCatalogFilters";
import { isDemoCatalog } from "../../features/catalog/catalogService";
import { Arrow } from "../ui/Arrow";
import { LessonCover } from "../lessons/LessonCover";
import { CatalogStatus } from "../lessons/CatalogStatus";

export function CatalogSection() {
  const { lessons, status, retry } = useCatalog();
  const { program, group, topic, query, setProgram, setQuery, resetFilters } =
    useCatalogFilters();
  const visibleLessons = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return lessons.filter(
      (lesson) =>
        (program === "Tümü" || lesson.program === program) &&
        (group === "Tümü" || lesson.group === group) &&
        (topic === "Tümü" || lesson.topic === topic) &&
        (!needle ||
          `${lesson.title} ${lesson.summary} ${lesson.group} ${lesson.topic}`
            .toLocaleLowerCase("tr")
            .includes(needle)),
    );
  }, [lessons, program, group, topic, query]);

  return (
    <section
      id="dersler"
      className="section-wrap lessons-section"
      aria-labelledby="lessons-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">DERS DEFTERİ / 02</span>
          <h2 id="lessons-title">
            Tahtadan <em>derse geç.</em>
          </h2>
          <p>
            {isDemoCatalog
              ? "Paylaştığınız eski kapaklara dayanarak hazırlanmış örnek kurs taslakları."
              : "FRC ve FLL eğitimlerini keşfet."}
          </p>
        </div>
        <span className="hand-annotation">Bir kapağı aç →</span>
      </div>
      <div className="lesson-toolbar">
        <div
          className="program-tabs"
          role="group"
          aria-label="Program filtresi"
        >
          {(["Tümü", "FRC", "FLL"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={program === item ? "active" : ""}
              aria-pressed={program === item}
              onClick={() => {
                setProgram(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <circle
              cx="10.8"
              cy="10.8"
              r="6.4"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <span className="sr-only">Ders ara</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ders ara..."
          />
        </label>
      </div>
      {(group !== "Tümü" || topic !== "Tümü") && (
        <div className="active-filter">
          <span>Seçili: {topic !== "Tümü" ? topic : group}</span>
          <button type="button" onClick={resetFilters}>
            Filtreyi temizle ×
          </button>
        </div>
      )}
      <CatalogStatus status={status} retry={retry} />
      <div className="lesson-grid" aria-live="polite">
        {visibleLessons.map((lesson) => (
          <a
            className="lesson-card"
            key={lesson.id}
            href={`/ders/${encodeURIComponent(lesson.id)}`}
          >
            <LessonCover lesson={lesson} />
            <span className="lesson-info">
              <span className="lesson-meta">
                {lesson.program} / {lesson.group}
                {!lesson.youtubeVideoId && " · TASLAK"}
              </span>
              <strong>{lesson.title}</strong>
              <span className="lesson-desc">{lesson.summary}</span>
              <span className="lesson-link">
                Dersi incele <Arrow diagonal />
              </span>
            </span>
          </a>
        ))}
      </div>
      {status === "ready" && visibleLessons.length === 0 && (
        <div className="empty-state">
          <strong>Bu başlık için ders henüz eklenmedi.</strong>
          <p>Kategori yapısı hazır. Başka bir başlığı inceleyebilirsiniz.</p>
          <button type="button" onClick={resetFilters}>
            Tüm dersleri göster <Arrow />
          </button>
        </div>
      )}
      {isDemoCatalog && (
        <p className="demo-note">
          Ders başlıkları ve açıklamaları geçici içerik taslaklarıdır. Video,
          kesin müfredat ve materyaller ekip tarafından eklenecek.
        </p>
      )}
    </section>
  );
}
