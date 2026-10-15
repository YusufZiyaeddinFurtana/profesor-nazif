import { useLocale } from "../../../i18n/LocaleProvider";
import { localizeLesson } from "../../../i18n/content/lessons";
import { useAuth } from "../../auth/AuthProvider";
import { useCatalog } from "../../catalog/CatalogProvider";
import { CatalogStatus } from "../../catalog/components/CatalogStatus";
import { programs } from "../../catalog/types";
import { usePreferences } from "../../interests/PreferencesProvider";
import { hasPreferences } from "../../interests/types";
import { PreferenceSummary } from "../../interests/components/InterestChoices";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";
import { programsAwaitingLessons, recommendLessons } from "../recommendLessons";
import { useLearning } from "../../learning/LearningProvider";

export function RecommendationsSection({ home = false }: { home?: boolean }) {
  const { t, locale } = useLocale();
  const { session } = useAuth();
  const { preferences, status, retry } = usePreferences();
  const { lessons, status: catalogStatus, retry: retryCatalog } = useCatalog();
  const { materials } = useLearning();
  if (!session) return null;
  const personalized = hasPreferences(preferences);
  const items = recommendLessons(
    lessons.map((lesson) => ({
      ...lesson,
      youtubeVideoId: materials.find((m) => m.lesson_id === lesson.id)
        ?.youtube_video_id,
    })),
    preferences,
  );
  const pending = programsAwaitingLessons(lessons, preferences);
  return (
    <section
      className={`recommendations-section${home ? " section-wrap recommendations-home" : ""}`}
      aria-labelledby={
        home ? "home-recommendations-title" : "account-recommendations-title"
      }
    >
      <div className="recommendations-heading">
        <div>
          <h2
            id={
              home
                ? "home-recommendations-title"
                : "account-recommendations-title"
            }
          >
            {t(
              personalized
                ? "recommendationsTitle"
                : "recommendationsDiscoverTitle",
            )}
          </h2>
          <p>
            {t(
              personalized
                ? "recommendationsDescription"
                : "recommendationsDiscoverDescription",
            )}
          </p>
        </div>
        <a className="text-action" href="/ilgi-alanlarim">
          {t(personalized ? "interestsEdit" : "interestsSet")}
          <Arrow />
        </a>
      </div>
      {status === "loading" || status === "idle" ? (
        <p className="preferences-loading" role="status">
          {t("interestsLoading")}
        </p>
      ) : status === "error" ? (
        <div className="preferences-error" role="alert">
          <p>{t("interestsLoadError")}</p>
          <button type="button" className="secondary-button" onClick={retry}>
            {t("retry")}
          </button>
        </div>
      ) : (
        <>
          {personalized && <PreferenceSummary value={preferences} />}
          <CatalogStatus status={catalogStatus} retry={retryCatalog} />
          {catalogStatus === "ready" &&
            (items.length ? (
              <ul className="recommendation-list">
                {items.map(({ lesson, category, focusArea }) => {
                  const localized = localizeLesson(lesson, locale);
                  return (
                    <li key={`${lesson.program}/${lesson.id}`}>
                      <a
                        href={educationPath(
                          lesson.program,
                          category.slug,
                          lesson.id,
                        )}
                      >
                        <div className="recommendation-copy">
                          <p className="recommendation-context">
                            {lesson.program} ·{" "}
                            {t(
                              focusArea === "engineering"
                                ? "interestsEngineering"
                                : "interestsBusiness",
                            )}
                          </p>
                          <h3>{localized.title}</h3>
                          <p>{localized.summary}</p>
                          <span className="recommendation-status">
                            {t(
                              lesson.youtubeVideoId
                                ? "videoLesson"
                                : "contentPending",
                            )}
                          </span>
                        </div>
                        <Arrow />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="recommendations-empty">
                <h3>{t("recommendationsEmptyTitle")}</h3>
                <p>{t("recommendationsEmptyDescription")}</p>
                <div className="recommendations-program-links">
                  {(preferences.programs.length
                    ? preferences.programs
                    : programs
                  ).map((program) => (
                    <a
                      className="text-action"
                      key={program}
                      href={educationPath(program)}
                    >
                      {t("programCourses", { program })}
                      <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          {catalogStatus === "ready" &&
            items.length > 0 &&
            pending.length > 0 && (
              <p className="recommendations-pending">
                {t("recommendationsPendingPrograms", {
                  programs: pending.join(", "),
                })}
              </p>
            )}
        </>
      )}
    </section>
  );
}
