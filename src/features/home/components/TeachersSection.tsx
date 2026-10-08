import { useLocale } from "../../../i18n/LocaleProvider";
import { teachers } from "../data/teachers";

export function TeachersSection() {
  const { t } = useLocale();
  return (
    <section id="egitmenler" className="section-wrap teachers-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t("teachersLabel")}</span>
          <h2>
            {t("teachersStart")} <em>{t("teachersEnd")}</em>
          </h2>
          <p>{t("teachersDescription")}</p>
        </div>
      </div>
      <div className="teacher-list">
        {teachers.map((name, index) => (
          <div key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{name}</strong>
            <small>{t("profilePending")}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
