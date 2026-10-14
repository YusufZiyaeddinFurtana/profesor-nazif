import test from "node:test";
import assert from "node:assert/strict";
import { calendarTarget } from "../src/features/booking/calendar.ts";
import { resolveRoute, educationPath } from "../src/app/routes.ts";
import {
  categories,
  courseGroups,
  findCategory,
  lessonsInCategory,
} from "../src/features/education/data/categories.ts";
import { lessons } from "../src/features/catalog/data/mockLessons.ts";
import { parseLessons } from "../src/features/catalog/parseLessons.ts";
import { instructors } from "../src/features/instructors/data/instructors.ts";
import { dictionaries } from "../src/i18n/translate.ts";

test("FTC routes and catalog validation use the same program identifiers", () => {
  assert.deepEqual(resolveRoute(educationPath("FTC", "programming")), {
    kind: "education",
    program: "FTC",
    categorySlug: "programming",
    lessonId: undefined,
  });
  assert.equal(courseGroups.filter((g) => g.program === "FTC").length, 4);
  for (const category of categories.filter((c) => c.program === "FTC"))
    assert.deepEqual(lessonsInCategory(lessons, category), []);
  const ftcLesson = {
    ...lessons[0],
    program: "FTC" as const,
    topic: "Programming",
    group: findCategory("FTC", "programming")!.group,
  };
  assert.equal(parseLessons([ftcLesson])[0].program, "FTC");
  assert.equal(
    lessonsInCategory([ftcLesson], findCategory("FTC", "programming")!).length,
    1,
  );
  assert.equal(
    lessonsInCategory([ftcLesson], findCategory("FRC", "programming")!).length,
    0,
  );
});
test("instructor and booking routes resolve with safe unknown-profile handling", () => {
  assert.deepEqual(resolveRoute("/egitmenler"), {
    kind: "instructors",
    instructorId: undefined,
  });
  assert.deepEqual(resolveRoute("/ozel-ders"), { kind: "booking" });
  for (const person of instructors)
    assert.deepEqual(resolveRoute(`/egitmenler/${person.id}`), {
      kind: "instructors",
      instructorId: person.id,
    });
  assert.equal(new Set(instructors.map((i) => i.id)).size, instructors.length);
  assert.equal(resolveRoute("/egitmenler/name/extra").kind, "not-found");
});
test("calendar configuration allows only Google booking pages", () => {
  assert.deepEqual(
    calendarTarget(
      "https://calendar.google.com/calendar/appointments/schedules/test",
    ),
    {
      url: "https://calendar.google.com/calendar/appointments/schedules/test",
      canEmbed: true,
    },
  );
  assert.equal(
    calendarTarget("https://calendar.app.google/Example123")?.canEmbed,
    false,
  );
  for (const url of [
    "https://evil.test/calendar/appointments/schedules/test",
    "https://calendar.google.com.evil.test/calendar/appointments/schedules/test",
    "javascript:alert(1)",
    "http://calendar.app.google/id",
    "https://name@calendar.app.google/id",
    "https://calendar.google.com/calendar/u/0/r",
    "https://calendar.app.google:999/id",
  ])
    assert.equal(calendarTarget(url), undefined, url);
});
test("the Nazif brand name stays consistent in every language", () => {
  for (const dictionary of Object.values(dictionaries))
    assert.equal(dictionary.brand, "Profesör Nazif");
});
