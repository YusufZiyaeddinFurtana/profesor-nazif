import { localizeCategory } from "../../../i18n/content/categories";
import { useLocale } from "../../../i18n/LocaleProvider";
import type { Program } from "../../catalog/types";
import { categories } from "../data/categories";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";

export function ProgramOverview({ program }: { program: Program }) {
  const { locale, t } = useLocale();
  return (
    <article className="program-overview">
      <h1>{t("programCourses", { program })}</h1>
      <p className="education-lead">
        {t(program === "FRC" ? "frcDescription" : "fllDescription")}
      </p>
      <div className="program-directory">
        {categories
          .filter((item) => item.program === program)
          .map((item) => localizeCategory(item, locale))
          .map((item) => (
            <a href={educationPath(program, item.slug)} key={item.slug}>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <Arrow diagonal />
            </a>
          ))}
      </div>
    </article>
  );
}
