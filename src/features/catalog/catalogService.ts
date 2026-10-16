import { supabase } from "../../lib/supabase";
import { getJson } from "../../services/http";
import type { Lesson } from "./types";

import { parseLessons } from "./parseLessons";

export async function loadLessons(signal: AbortSignal): Promise<Lesson[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl && supabase) {
    const { data, error } = await supabase
      .from("lesson_catalog")
      .select(
        "id,program,lesson_group,topic,title,summary,long_description,translations,cover_label,image,video_available",
      )
      .eq("is_listed", true)
      .order("sort_order")
      .order("id")
      .abortSignal(signal);
    if (error) throw error;
    return parseLessons(
      (data ?? []).map((row) => ({
        id: row.id,
        program: row.program,
        group: row.lesson_group,
        topic: row.topic,
        title: row.title,
        summary: row.summary,
        longDescription: row.long_description,
        translations: row.translations,
        coverLabel: row.cover_label ?? undefined,
        image: row.image ?? undefined,
        videoAvailable: row.video_available,
      })),
    );
  }
  if (!baseUrl) {
    const { lessons } = await import("./data/mockLessons");
    return lessons;
  }
  return parseLessons(
    await getJson(`${baseUrl.replace(/\/$/, "")}/lessons`, signal),
  );
}
