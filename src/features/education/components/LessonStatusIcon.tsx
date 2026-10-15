export type LessonState = "not-started" | "in-progress" | "completed";
/** Presentation only; EducationSidebar supplies the student's persisted state. */
export function LessonStatusIcon({
  state = "not-started",
}: {
  state?: LessonState;
}) {
  return (
    <svg
      className={`lesson-state lesson-state--${state}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {state === "completed" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m7 12 3 3 7-7" />
        </>
      ) : state === "in-progress" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 6 4-6 4V8Z" />
        </>
      ) : (
        <circle cx="12" cy="12" r="8" />
      )}
    </svg>
  );
}
