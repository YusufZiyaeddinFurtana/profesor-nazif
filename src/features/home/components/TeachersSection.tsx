import { useLocale } from "../../../i18n/LocaleProvider";
import { instructors } from "../../instructors/data/instructors";
import { Arrow } from "../../../components/ui/Arrow";
export function TeachersSection() {
  const { t } = useLocale();
  return (
    <section id="egitmenler" className="section-wrap teachers-section">
      <div className="section-heading">
        <div>
          <h2>{t("instructors")}</h2>
          <p>{t("instructorsDescription")}</p>
        </div>
        <a className="text-action" href="/egitmenler">
          {t("allInstructors")}
          <Arrow diagonal />
        </a>
      </div>
      <div className="instructor-preview">
        {instructors.map((instructor) => (
          <a href={`/egitmenler/${instructor.id}`} key={instructor.id}>
            <strong>{instructor.name}</strong>
            <Arrow diagonal />
          </a>
        ))}
      </div>
    </section>
  );
}
