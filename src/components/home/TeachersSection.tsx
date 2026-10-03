import { teachers } from "../../data/siteContent";

export function TeachersSection() {
  return (
    <section id="egitmenler" className="section-wrap teachers-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SINIFTA KİMLER VAR?</span>
          <h2>
            Öğretmen <em>kadrosu.</em>
          </h2>
          <p>
            Eski içerik dokümanında yer alan isimler. Fotoğraf ve profil
            açıklamaları hazır olduğunda bu alan tamamlanacak.
          </p>
        </div>
      </div>
      <div className="teacher-list">
        {teachers.map((name, index) => (
          <div key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{name}</strong>
            <small>Profil hazırlanıyor</small>
          </div>
        ))}
      </div>
    </section>
  );
}
