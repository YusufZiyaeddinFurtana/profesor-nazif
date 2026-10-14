import type { Instructor } from "../types";
import { useLocale } from "../../../i18n/LocaleProvider";
export function InstructorPortrait({ instructor }: { instructor: Instructor }) {
  const { t } = useLocale();
  return instructor.photo ? (
    <img
      className="instructor-photo"
      src={instructor.photo}
      alt={instructor.name}
      loading="lazy"
      width="360"
      height="420"
    />
  ) : (
    <div className="instructor-photo instructor-photo--pending">
      <svg
        viewBox="0 0 80 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="40" cy="26" r="12" />
        <path d="M16 65c0-16 10-25 24-25s24 9 24 25" />
      </svg>
      <span>{t("photoPending")}</span>
    </div>
  );
}
