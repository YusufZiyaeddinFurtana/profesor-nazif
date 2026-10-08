import { useLocale } from "../../../i18n/LocaleProvider";
export function JourneySection() {
  const { t } = useLocale();
  return (
    <section id="nasil-calisir" className="journey-section">
      <div className="section-wrap journey-layout">
        <div>
          <span className="eyebrow">{t("method")}</span>
          <h2>
            {t("understand")}
            <br />
            <em>{t("try")}</em>
          </h2>
          <p>{t("methodDescription")}</p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <strong>{t("step1")}</strong>
            <p>{t("step1Description")}</p>
          </li>
          <li>
            <span>02</span>
            <strong>{t("step2")}</strong>
            <p>{t("step2Description")}</p>
          </li>
          <li>
            <span>03</span>
            <strong>{t("step3")}</strong>
            <p>{t("step3Description")}</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
