import test from "node:test";
import assert from "node:assert/strict";
import { dictionaries, isLocale, translate } from "../src/i18n/translate.ts";
import { locales } from "../src/i18n/types.ts";
import { localizeLesson } from "../src/i18n/content/lessons.ts";
import {
  localizeCategory,
  localizeGroup,
} from "../src/i18n/content/categories.ts";
import {
  categories,
  courseGroups,
  getCategoryForLesson,
  lessonsInCategory,
} from "../src/features/education/data/categories.ts";
import { lessons } from "../src/features/catalog/data/mockLessons.ts";
import { parseLessons } from "../src/features/catalog/parseLessons.ts";

test("each language covers the UI and preserves interpolation variables", () => {
  const keys = Object.keys(dictionaries.tr);
  for (const locale of locales) {
    assert.deepEqual(
      Object.keys(dictionaries[locale]).sort(),
      [...keys].sort(),
    );
    for (const key of keys as (keyof typeof dictionaries.tr)[]) {
      const value = dictionaries[locale][key];
      assert.ok(value.trim(), `${locale}/${key} is empty`);
      assert.deepEqual(
        (value.match(/\{\w+\}/g) ?? []).sort(),
        (dictionaries.tr[key].match(/\{\w+\}/g) ?? []).sort(),
      );
    }
    assert.ok(
      translate(locale, "programCourses", { program: "FRC" }).includes("FRC"),
    );
    assert.ok(!translate(locale, "lessonNumber", { number: 2 }).includes("{"));
  }
  for (const unsupported of ["zh", "fr", "toString", "__proto__", null])
    assert.equal(isLocale(unsupported), false);
});
test("translated lessons and categories retain routing and grouping identities", () => {
  for (const locale of locales) {
    const translatedLessons = lessons.map((lesson) =>
      localizeLesson(lesson, locale),
    );
    for (const category of categories) {
      const translatedCategory = localizeCategory(category, locale);
      assert.deepEqual(
        lessonsInCategory(translatedLessons, translatedCategory).map(
          (l) => l.id,
        ),
        lessonsInCategory(lessons, category).map((l) => l.id),
      );
      if (locale !== "tr")
        assert.notEqual(translatedCategory.description, category.description);
    }
    for (const group of courseGroups) {
      const translated = localizeGroup(group, locale);
      assert.equal(translated.categorySlug, group.categorySlug);
      if (locale !== "tr")
        assert.notEqual(translated.description, group.description);
    }
    for (let i = 0; i < lessons.length; i++) {
      assert.equal(
        getCategoryForLesson(translatedLessons[i])?.slug,
        getCategoryForLesson(lessons[i])?.slug,
      );
      if (locale !== "tr")
        for (const key of ["title", "summary", "longDescription"] as const)
          assert.notEqual(translatedLessons[i][key], lessons[i][key]);
    }
  }
});
test("API content owns translations and falls back to its original copy", () => {
  const lesson = {
    ...lessons[0],
    title: "Backend title",
    translations: undefined,
  };
  assert.equal(localizeLesson(lesson, "en").title, "Backend title");
  const custom = {
    ...lesson,
    translations: {
      en: {
        title: "Custom translation",
        summary: "Summary",
        longDescription: "Details",
        id: "cannot-replace-id",
      },
    },
  };
  assert.equal(localizeLesson(parseLessons([custom])[0], "en").id, lesson.id);
  assert.equal(localizeLesson(custom, "en").title, "Custom translation");
  assert.equal(localizeLesson(custom, "hil").title, "Backend title");
  for (const translations of [
    [],
    null,
    { fr: { title: "x", summary: "x", longDescription: "x" } },
    { en: { title: 3, summary: "x", longDescription: "x" } },
    { hil: { title: "x" } },
  ])
    assert.throws(() => parseLessons([{ ...lesson, translations }]));
});
