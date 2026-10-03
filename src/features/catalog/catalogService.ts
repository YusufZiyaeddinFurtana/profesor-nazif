import { getJson } from "../../services/http";
import type { Lesson } from "./types";

export const isDemoCatalog = !import.meta.env.VITE_API_BASE_URL?.trim();

const requiredStrings = [
  "id",
  "group",
  "topic",
  "title",
  "summary",
  "longDescription",
  "coverLabel",
] as const;
function parseLessons(value: unknown): Lesson[] {
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
    return row as Lesson;
  });
}
export async function loadLessons(signal: AbortSignal): Promise<Lesson[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) {
    const { lessons } = await import("../../data/mockLessons");
    return lessons;
  }
  return parseLessons(
    await getJson(`${baseUrl.replace(/\/$/, "")}/lessons`, signal),
  );
}
