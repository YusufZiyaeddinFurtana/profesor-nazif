import test from "node:test";
import assert from "node:assert/strict";
import {
  categories,
  courseGroups,
  findCategory,
  getCategoryForLesson,
  lessonsInCategory,
} from "../src/features/education/data/categories.ts";
import { lessons } from "../src/features/catalog/data/mockLessons.ts";

test("each homepage group resolves to a category, and category URLs are unique", () => {
  const keys = categories.map((item) => `${item.program}/${item.slug}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const group of courseGroups)
    assert.ok(findCategory(group.program, group.categorySlug));
});
test("all existing lessons belong to a reachable category", () => {
  for (const lesson of lessons) {
    const category = getCategoryForLesson(lesson);
    assert.ok(category, lesson.id);
    assert.ok(
      lessonsInCategory(lessons, category).some(
        (item) => item.id === lesson.id,
      ),
    );
  }
});
test("programming separates FRC from FLL; business groups multiple related topics", () => {
  assert.deepEqual(
    lessonsInCategory(lessons, findCategory("FRC", "programming")!).map(
      (item) => item.id,
    ),
    ["wpilib-java", "pid-otonom"],
  );
  assert.deepEqual(
    lessonsInCategory(lessons, findCategory("FLL", "programlama")!).map(
      (item) => item.id,
    ),
    ["fll-mindstorms"],
  );
  assert.deepEqual(
    lessonsInCategory(lessons, findCategory("FRC", "business-management")!).map(
      (item) => item.id,
    ),
    ["takim-surekliligi"],
  );
  assert.deepEqual(
    lessonsInCategory(lessons, findCategory("FRC", "scouting")!),
    [],
  );
});
