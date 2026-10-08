import { locales } from "../../i18n/types.ts";
import type { Lesson } from "./types";

const requiredStrings = [
  "id",
  "group",
  "topic",
  "title",
  "summary",
  "longDescription",
] as const;
export function parseLessons(value: unknown): Lesson[] {
  if (!Array.isArray(value))
    throw new Error("API ders listesini dizi olarak döndürmeli.");
  const ids = new Set<string>();
  return value.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Geçersiz ders.");
    const row = item as Record<string, unknown>;
    if (
      requiredStrings.some(
        (key) => typeof row[key] !== "string" || (key === "id" && !row[key]),
      ) ||
      !["FRC", "FLL"].includes(String(row.program))
    )
      throw new Error("Ders alanları eksik.");
    if (ids.has(row.id as string))
      throw new Error("Ders kimlikleri benzersiz olmalı.");
    ids.add(row.id as string);
    if (row.coverLabel !== undefined && typeof row.coverLabel !== "string")
      throw new Error("Geçersiz kapak etiketi.");
    if (
      row.image !== undefined &&
      (typeof row.image !== "string" ||
        !/^(https:\/\/|\/(?!\/))/.test(row.image))
    )
      throw new Error("Geçersiz kapak adresi.");
    if (
      row.youtubeVideoId !== undefined &&
      (typeof row.youtubeVideoId !== "string" ||
        !/^[A-Za-z0-9_-]{11}$/.test(row.youtubeVideoId))
    )
      throw new Error("Geçersiz YouTube video kimliği.");
    if (row.translations !== undefined) {
      if (
        !row.translations ||
        typeof row.translations !== "object" ||
        Array.isArray(row.translations)
      )
        throw new Error("Geçersiz ders çevirileri.");
      for (const [locale, value] of Object.entries(row.translations)) {
        if (
          !(locales as readonly string[]).includes(locale) ||
          !value ||
          typeof value !== "object" ||
          ["title", "summary", "longDescription"].some(
            (key) =>
              typeof (value as Record<string, unknown>)[key] !== "string",
          )
        )
          throw new Error("Geçersiz ders çevirisi.");
      }
    }
    return row as Lesson;
  });
}
