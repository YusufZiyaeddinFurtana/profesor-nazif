import { useLocale } from "../../../i18n/LocaleProvider";
import { Arrow } from "../../../components/ui/Arrow";
import { contactUrl } from "../../../config/site";

export function ContactSection() {
  const { t } = useLocale();
  return (
    <section id="ozel-ders" className="contact-section">
      <div className="section-wrap contact-layout">
        <div>
          <span className="eyebrow">{t("learnTogether")}</span>
          <h2>{t("contactTitle")}</h2>
          <p>{t("contactDescription")}</p>
        </div>
        <a href={contactUrl} target="_blank" rel="noreferrer">
          {t("contactAction")} <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
