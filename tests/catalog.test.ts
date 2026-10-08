import test from "node:test";
import assert from "node:assert/strict";
import { parseLessons } from "../src/features/catalog/parseLessons.ts";
import { lessons } from "../src/features/catalog/data/mockLessons.ts";

test("API accepts existing lessons and empty catalog", () => {
  assert.deepEqual(parseLessons(lessons), lessons);
  assert.deepEqual(parseLessons([]), []);
});
test("invalid API data cannot enter the lesson state", () => {
  for (const value of [
    { lessons },
    [null],
    [{ ...lessons[0], program: "OTHER" }],
    [{ ...lessons[0], title: 42 }],
    [lessons[0], lessons[0]],
    [{ ...lessons[0], image: "javascript:alert(1)" }],
    [{ ...lessons[0], youtubeVideoId: "not-an-id" }],
  ])
    assert.throws(() => parseLessons(value));
});
