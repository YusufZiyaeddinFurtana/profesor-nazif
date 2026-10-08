import { getJson } from "../../services/http";
import type { Lesson } from "./types";

import { parseLessons } from "./parseLessons";

export async function loadLessons(signal: AbortSignal): Promise<Lesson[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) {
    const { lessons } = await import("./data/mockLessons");
    return lessons;
  }
  return parseLessons(
    await getJson(`${baseUrl.replace(/\/$/, "")}/lessons`, signal),
  );
}
