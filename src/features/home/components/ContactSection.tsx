import { useLocale } from "../../../i18n/LocaleProvider";
import { Arrow } from "../../../components/ui/Arrow";

export function ContactSection() {
  const { t } = useLocale();
  return (
    <section id="ozel-ders" className="contact-section">
      <div className="section-wrap contact-layout">
        <div>
          <h2>{t("contactTitle")}</h2>
          <p>{t("contactDescription")}</p>
        </div>
        <a href="/ozel-ders">
          {t("contactAction")} <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
