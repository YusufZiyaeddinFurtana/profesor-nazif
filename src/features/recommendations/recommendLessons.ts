import type { Lesson, Program } from "../catalog/types.ts";
import { getCategoryForLesson } from "../education/data/categories.ts";
import type { EducationCategory } from "../education/types.ts";
import {
  normalizePreferences,
  type FocusArea,
  type LearningPreferences,
} from "../interests/types.ts";

const areasByCategory: Record<string, FocusArea> = {
  mechanics: "engineering",
  electronics: "engineering",
  programming: "engineering",
  "robot-yapimi": "engineering",
  programlama: "engineering",
  "business-management": "business",
  scouting: "business",
  fundraising: "business",
  sustainability: "business",
  leadership: "business",
  first: "business",
  media: "business",
  ozdegerler: "business",
  proje: "business",
};
export function focusForCategory(
  category: EducationCategory,
): FocusArea | undefined {
  return areasByCategory[category.slug];
}
export type Recommendation = {
  lesson: Lesson;
  category: EducationCategory;
  focusArea: FocusArea;
};

/** Explicit interests, available catalog only. Category variety; playable lessons first. */
export function recommendLessons(
  lessons: Lesson[],
  input: LearningPreferences,
  limit = 4,
): Recommendation[] {
  const preferences = normalizePreferences(input);
  const seenLessons = new Set<string>();
  const candidates: Recommendation[] = [];
  for (const lesson of lessons) {
    const identity = `${lesson.program}/${lesson.id}`;
    if (seenLessons.has(identity)) continue;
    seenLessons.add(identity);
    const category = getCategoryForLesson(lesson);
    const focusArea = category && focusForCategory(category);
    if (!category || !focusArea) continue;
    if (
      preferences.programs.length &&
      !preferences.programs.includes(lesson.program)
    )
      continue;
    if (
      preferences.focusAreas.length &&
      !preferences.focusAreas.includes(focusArea)
    )
      continue;
    candidates.push({ lesson, category, focusArea });
  }
  candidates.sort(
    (a, b) =>
      Number(!!b.lesson.youtubeVideoId) - Number(!!a.lesson.youtubeVideoId),
  );
  const usedCategories = new Set<string>();
  const first: Recommendation[] = [],
    rest: Recommendation[] = [];
  for (const item of candidates) {
    const key = `${item.category.program}/${item.category.slug}`;
    (usedCategories.has(key) ? rest : first).push(item);
    usedCategories.add(key);
  }
  // A long FRC catalog must not hide a selected FLL program or business interest.
  const represented = new Set<string>();
  const leads: Recommendation[] = [],
    others: Recommendation[] = [];
  for (const item of first) {
    const key = `${item.lesson.program}/${item.focusArea}`;
    (represented.has(key) ? others : leads).push(item);
    represented.add(key);
  }
  return [...leads, ...others, ...rest].slice(
    0,
    Math.max(0, Math.floor(limit)),
  );
}
export function programsAwaitingLessons(
  lessons: Lesson[],
  preferences: LearningPreferences,
): Program[] {
  return preferences.programs.filter(
    (program) =>
      recommendLessons(lessons, { ...preferences, programs: [program] }, 1)
        .length === 0,
  );
}
