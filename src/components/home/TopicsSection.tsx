import { frcTopics } from "../../data/siteContent";

export function TopicsSection() {
  return (
    <section
      id="frc-konular"
      className="topics-section"
      aria-labelledby="topics-title"
    >
      <div className="section-wrap">
        <div className="section-heading section-heading--light">
          <div>
            <span className="eyebrow">FRC / KONU HARİTASI</span>
            <h2 id="topics-title">FRC tahtasında neler var?</h2>
            <p>
              Eski sitenin konu başlıklarını, ilgili derslerle birlikte yeniden
              düzenledik.
            </p>
          </div>
          <span className="hand-annotation">Her çizgi bir soru.</span>
        </div>
        <div className="topic-grid">
          {frcTopics.map((item, index) => (
            <a
              href={`/?program=FRC&topic=${encodeURIComponent(item.title)}#dersler`}
              key={item.title}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
        <p className="topic-note">
          Bu başlıklar gezinme için hazır. Dersi henüz eklenmeyen konularda
          katalog boş durumunu gösterir.
        </p>
      </div>
    </section>
  );
}
