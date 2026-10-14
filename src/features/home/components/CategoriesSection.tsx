import { localizeGroup } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import { courseGroups } from "../../education/data/categories";
import { programs } from "../../catalog/types";
import { educationPath } from "../../../app/routes";
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
      </div>
      <div className="program-grid">
        {programs.map((program) => (
          <article
            className={`program-panel program-panel--${program.toLowerCase()}`}
            key={program}
          >
            <div className="program-heading">
              <h3>
                <a href={educationPath(program)}>
                  {program}
                  <Arrow diagonal />
                </a>
              </h3>
              <p>
                {t(
                  program === "FRC"
                    ? "frcShort"
                    : program === "FTC"
                      ? "ftcShort"
                      : "fllShort",
                )}
              </p>
            </div>
            <div className="program-groups">
              {courseGroups
                .filter((c) => c.program === program)
                .map((c) => localizeGroup(c, locale))
                .map((c) => (
                  <a key={c.id} href={educationPath(program, c.categorySlug)}>
                    <strong>
                      {c.title}
                      <Arrow diagonal />
                    </strong>
                    <span>{c.description}</span>
                  </a>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
