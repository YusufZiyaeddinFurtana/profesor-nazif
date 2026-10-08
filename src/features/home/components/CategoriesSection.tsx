import { localizeGroup } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import { courseGroups } from "../../education/data/categories";
import { educationPath } from "../../../app/routes";
import type { Program } from "../../catalog/types";
import { Arrow } from "../../../components/ui/Arrow";

export function CategoriesSection() {
  const { locale, t } = useLocale();
  return (
    <section
      id="kategoriler"
      className="section-wrap categories-section"
      aria-labelledby="categories-title"
    >
      <div className="section-heading">
        <div>
          <h2 id="categories-title">
            {t("categoriesStart")} <em>{t("categoriesEnd")}</em>
          </h2>
          <p>{t("categoriesDescription")}</p>
        </div>
        <span className="hand-annotation">{t("chooseDoor")}</span>
      </div>
      <div className="program-grid">
        {(["FRC", "FLL"] as Program[]).map((item) => (
          <article
            className={`program-panel program-panel--${item.toLowerCase()}`}
            key={item}
          >
            <div className="program-heading">
              <span className="program-index">
                {item === "FRC" ? "01" : "02"} / {t("programLabel")}
              </span>
              <h3>{item}</h3>
              <p>{t(item === "FRC" ? "frcShort" : "fllShort")}</p>
            </div>
            <div className="program-groups">
              {courseGroups
                .filter((entry) => entry.program === item)
                .map((entry) => localizeGroup(entry, locale))
                .map((entry) => (
                  <a
                    key={entry.id}
                    href={educationPath(item, entry.categorySlug)}
                  >
                    <strong>
                      {entry.title} <Arrow diagonal />
                    </strong>
                    <span>{entry.description}</span>
                  </a>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
