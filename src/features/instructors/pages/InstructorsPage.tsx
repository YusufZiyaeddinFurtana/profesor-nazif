import { useEffect } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { instructors } from "../data/instructors";
import { InstructorPortrait } from "../components/InstructorPortrait";
import { NotFoundPage } from "../../../pages/NotFoundPage";
import { Arrow } from "../../../components/ui/Arrow";
export function InstructorsPage({ instructorId }: { instructorId?: string }) {
  const { locale, t } = useLocale();
  const instructor = instructorId
    ? instructors.find((i) => i.id === instructorId)
    : undefined;
  const invalid = Boolean(instructorId && !instructor);
  useEffect(() => {
    document.title = `${invalid ? t("notFoundTitle") : (instructor?.name ?? t("instructors"))} — Profesör Nazif`;
  }, [instructor?.name, invalid, t]);
  if (invalid) return <NotFoundPage />;
  return (
    <section className="section-wrap instructors-page">
      {instructor ? (
        <>
          <a className="text-action" href="/egitmenler">
            {t("instructors")}
            <Arrow />
          </a>
          <article className="instructor-profile">
            <InstructorPortrait instructor={instructor} />
            <div>
              <h1>{instructor.name}</h1>
              <dl className="instructor-facts">
                <div>
                  <dt>{t("university")}</dt>
                  <dd>{instructor.university || "—"}</dd>
                </div>
                <div>
                  <dt>{t("firstExperience")}</dt>
                  <dd>{instructor.firstExperience || "—"}</dd>
                </div>
              </dl>
              <section className="instructor-bio">
                <h2>{t("aboutInstructor")}</h2>
                <p>
                  {instructor.bio?.[locale] ??
                    instructor.bio?.tr ??
                    t("profileDetailsPending")}
                </p>
              </section>
              <a className="primary-button" href="/ozel-ders">
                {t("contactAction")}
                <Arrow />
              </a>
            </div>
          </article>
        </>
      ) : (
        <>
          <header className="instructors-heading">
            <h1>{t("instructors")}</h1>
            <p>{t("instructorsDescription")}</p>
          </header>
          <div className="instructors-directory">
            {instructors.map((item) => (
              <article className="instructor-entry" key={item.id}>
                <a
                  href={`/egitmenler/${item.id}`}
                  aria-label={`${t("viewProfile")}: ${item.name}`}
                >
                  <InstructorPortrait instructor={item} />
                  <h2>{item.name}</h2>
                </a>
                <dl className="instructor-facts">
                  <div>
                    <dt>{t("university")}</dt>
                    <dd>{item.university || "—"}</dd>
                  </div>
                  <div>
                    <dt>{t("firstExperience")}</dt>
                    <dd>{item.firstExperience || "—"}</dd>
                  </div>
                </dl>
                <p>
                  {item.bio?.[locale] ??
                    item.bio?.tr ??
                    t("profileDetailsPending")}
                </p>
                <a className="text-action" href={`/egitmenler/${item.id}`}>
                  {t("viewProfile")}
                  <Arrow diagonal />
                </a>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
