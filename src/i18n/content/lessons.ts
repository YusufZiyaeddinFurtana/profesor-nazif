import type { Lesson } from "../../features/catalog/types";
import type { Locale } from "../types";
/** Missing translations fall back to the source lesson without losing its stable identity. */
export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  const translation = lesson.translations?.[locale];
  return translation
    ? {
        ...lesson,
        title: translation.title,
        summary: translation.summary,
        longDescription: translation.longDescription,
      }
    : lesson;
}
