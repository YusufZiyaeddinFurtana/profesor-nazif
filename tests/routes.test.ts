import test from "node:test";
import assert from "node:assert/strict";
import { educationPath, resolveRoute } from "../src/app/routes.ts";

test("category and lesson routes round-trip, including encoded lesson identifiers", () => {
  const path = educationPath("FRC", "programming", "ders 1");
  assert.equal(path, "/egitimler/frc/programming/ders%201");
  assert.deepEqual(resolveRoute(path), {
    kind: "education",
    program: "FRC",
    categorySlug: "programming",
    lessonId: "ders 1",
  });
  assert.deepEqual(resolveRoute("/egitimler/fll/proje/"), {
    kind: "education",
    program: "FLL",
    categorySlug: "proje",
    lessonId: undefined,
  });
});
test("malformed, unsupported and extra path segments resolve safely to not-found", () => {
  for (const path of [
    "/egitimler/abc/proje",
    "/egitimler/frc/%E0%A4%A",
    "/egitimler/frc/programming/a/extra",
    "/egitimler/frc/%2F",
    "/egitimler//proje",
  ])
    assert.equal(resolveRoute(path).kind, "not-found");
});
test("existing shared lesson URLs stay recognized for redirect", () => {
  assert.deepEqual(resolveRoute("/ders/wpilib-java"), {
    kind: "legacy-lesson",
    lessonId: "wpilib-java",
  });
});
