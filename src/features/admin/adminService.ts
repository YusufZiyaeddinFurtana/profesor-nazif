import { supabase } from "../../lib/supabase";
import type { AdminLesson, LessonInput } from "./types";
function client() {
  if (!supabase) throw new Error("Supabase unavailable");
  return supabase;
}
export async function checkAdmin(signal: AbortSignal): Promise<boolean> {
  const { data, error } = await client().rpc("is_admin").abortSignal(signal);
  if (error) throw error;
  return data === true;
}
export async function adminLessons(
  signal: AbortSignal,
): Promise<AdminLesson[]> {
  const { data, error } = await client()
    .rpc("admin_lessons")
    .abortSignal(signal);
  if (error) throw error;
  return data as AdminLesson[];
}
export async function uploadPdf(userId: string, file: File) {
  const path = `admin/${userId}/${crypto.randomUUID()}.pdf`;
  const { error } = await client()
    .storage.from("lesson-exercises")
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (error) throw error;
  return path;
}
export async function saveLesson(input: LessonInput) {
  const { data, error } = await client().rpc("admin_save_lesson", {
    p_input: input,
  });
  if (error) throw error;
  return data as string;
}
