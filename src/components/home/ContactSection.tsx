import { Arrow } from "../ui/Arrow";
import { contactUrl } from "../../data/siteContent";

export function ContactSection() {
  return (
    <section id="ozel-ders" className="contact-section">
      <div className="section-wrap contact-layout">
        <div>
          <span className="eyebrow">BİRLİKTE ÖĞRENELİM</span>
          <h2>Aklında özel bir soru mu var?</h2>
          <p>
            Özel ders veya eğitim talebi için takımın iletişim sayfasına
            ulaşabilirsin.
          </p>
        </div>
        <a href={contactUrl} target="_blank" rel="noreferrer">
          Özel ders talep et <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
