import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/features/catalog/data/mockLessons.ts";
import { normalizePreferences } from "../src/features/interests/types.ts";
import {
  recommendLessons,
  programsAwaitingLessons,
} from "../src/features/recommendations/recommendLessons.ts";
import { resolveRoute, educationPath } from "../src/app/routes.ts";

test("a large program does not crowd out other selected programs and focus areas", () => {
  const items = recommendLessons(lessons, {
    programs: ["FRC", "FLL"],
    focusAreas: ["engineering", "business"],
  });
  assert.deepEqual(
    new Set(
      items.map(({ lesson, focusArea }) => `${lesson.program}/${focusArea}`),
    ),
    new Set([
      "FRC/engineering",
      "FRC/business",
      "FLL/engineering",
      "FLL/business",
    ]),
  );
});

test("preferences accept only supported IDs and remove duplicates without relying on display language", () => {
  assert.deepEqual(
    normalizePreferences({
      programs: ["FLL", "FRC", "FRC", "admin", null],
      focusAreas: ["engineering", "engineering", "role"],
    }),
    { programs: ["FRC", "FLL"], focusAreas: ["engineering"] },
  );
  assert.deepEqual(
    normalizePreferences({ programs: "FRC", focusAreas: null }),
    { programs: [], focusAreas: [] },
  );
  assert.deepEqual(normalizePreferences(null), {
    programs: [],
    focusAreas: [],
  });
});
test("recommendations honor BOTH program and focus, with no unrelated-program fallback", () => {
  const business = recommendLessons(lessons, {
    programs: ["FRC"],
    focusAreas: ["business"],
  });
  assert.deepEqual(
    business.map((item) => item.lesson.id),
    ["takim-surekliligi"],
  );
  const engineering = recommendLessons(lessons, {
    programs: ["FLL"],
    focusAreas: ["engineering"],
  });
  assert.deepEqual(
    engineering.map((item) => item.lesson.id),
    ["fll-mindstorms", "fll-robot-yapimi"],
  );
  assert.deepEqual(
    recommendLessons(lessons, {
      programs: ["FTC"],
      focusAreas: ["engineering"],
    }),
    [],
  );
  assert.deepEqual(
    programsAwaitingLessons(lessons, {
      programs: ["FTC", "FRC"],
      focusAreas: ["engineering"],
    }),
    ["FTC"],
  );
});
test("exploration supports skipped or partial choices and links only to valid catalog lessons", () => {
  const choices = [
    { programs: [] as const, focusAreas: [] as const },
    { programs: ["FRC"] as const, focusAreas: [] as const },
    { programs: [] as const, focusAreas: ["business"] as const },
  ];
  for (const choice of choices) {
    const items = recommendLessons(lessons, {
      programs: [...choice.programs],
      focusAreas: [...choice.focusAreas],
    });
    assert.ok(items.length > 0 && items.length <= 4);
    for (const { lesson, category } of items)
      assert.equal(
        resolveRoute(educationPath(lesson.program, category.slug, lesson.id))
          .kind,
        "education",
      );
  }
  assert.equal(resolveRoute("/ilgi-alanlarim").kind, "interests");
});
test("category variety precedes repeats; playable lessons lead their category and duplicate IDs are ignored", () => {
  const catalog = [
    ...lessons,
    { ...lessons[0], id: "playable-java", youtubeVideoId: "dQw4w9WgXcQ" },
    lessons[0],
  ];
  const result = recommendLessons(
    catalog,
    { programs: ["FRC"], focusAreas: ["engineering"] },
    10,
  );
  assert.equal(result[0].lesson.id, "playable-java");
  assert.equal(
    new Set(result.slice(0, 3).map((item) => item.category.slug)).size,
    3,
  );
  assert.equal(
    new Set(result.map((item) => item.lesson.id)).size,
    result.length,
  );
  assert.deepEqual(
    recommendLessons(catalog, { programs: [], focusAreas: [] }, 0),
    [],
  );
});
