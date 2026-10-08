import { localizeCategory } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import { frcCategories } from "../../education/data/categories";
import { educationPath } from "../../../app/routes";

export function TopicsSection() {
  const { locale, t } = useLocale();
  return (
    <section
      id="frc-konular"
      className="topics-section"
      aria-labelledby="topics-title"
    >
      <div className="section-wrap">
        <div className="section-heading section-heading--light">
          <div>
            <h2 id="topics-title">{t("topicsTitle")}</h2>
            <p>{t("topicsDescription")}</p>
          </div>
          <span className="hand-annotation">{t("everyLine")}</span>
        </div>
        <div className="topic-grid">
          {frcCategories
            .map((item) => localizeCategory(item, locale))
            .map((item, index) => (
              <a href={educationPath(item.program, item.slug)} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
        </div>
        <p className="topic-note">{t("topicsNote")}</p>
      </div>
    </section>
  );
}
