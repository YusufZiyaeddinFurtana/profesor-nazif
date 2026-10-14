import { programs, type Program } from "../catalog/types.ts";

export const focusAreas = ["engineering", "business"] as const;
export type FocusArea = (typeof focusAreas)[number];
export type LearningPreferences = {
  programs: Program[];
  focusAreas: FocusArea[];
};
export const emptyPreferences: LearningPreferences = {
  programs: [],
  focusAreas: [],
};

/** Canonical IDs only. Display translations and user metadata never grant permissions. */
export function normalizePreferences(value: unknown): LearningPreferences {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const selectedPrograms = Array.isArray(source.programs)
    ? source.programs
    : [];
  const selectedAreas = Array.isArray(source.focusAreas)
    ? source.focusAreas
    : [];
  return {
    programs: programs.filter((program) => selectedPrograms.includes(program)),
    focusAreas: focusAreas.filter((area) => selectedAreas.includes(area)),
  };
}
export function hasPreferences(value: LearningPreferences) {
  return value.programs.length > 0 || value.focusAreas.length > 0;
}
export function toggleChoice<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
