import { useLocale } from "../../../i18n/LocaleProvider";
/** Replace only this board's interior when adding the real video provider. */
export function LessonVideo({ title }: { title: string }) {
  const { t } = useLocale();
  return (
    <section className="lesson-video" aria-label={t("lessonVideo", { title })}>
      <div className="video-board-frame">
        <div className="video-board-surface">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle
              cx="32"
              cy="32"
              r="29"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="m26 21 18 11-18 11V21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <p>{t("videoPending")}</p>
          <span>{t("videoPlaceholder")}</span>
        </div>
      </div>
    </section>
  );
}
