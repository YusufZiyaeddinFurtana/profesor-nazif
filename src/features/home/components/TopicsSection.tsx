import { frcCategories } from "../../education/data/categories";
import { educationPath } from "../../../app/routes";

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
            <h2 id="topics-title">FRC tahtasında neler var?</h2>
            <p>
              İlgini çeken alanın sayfasını aç; açıklamasını ve derslerini
              birlikte keşfet.
            </p>
          </div>
          <span className="hand-annotation">Her çizgi bir soru.</span>
        </div>
        <div className="topic-grid">
          {frcCategories.map((item, index) => (
            <a href={educationPath(item.program, item.slug)} key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
        <p className="topic-note">
          Her başlık kendi eğitim sayfasına açılır. Yeni dersler geldikçe ders
          menüsüne eklenir.
        </p>
      </div>
    </section>
  );
}
