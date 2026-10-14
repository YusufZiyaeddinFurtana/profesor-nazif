import { supabase } from "../../lib/supabase";
import { normalizePreferences, type LearningPreferences } from "./types";

const columns = "interest_programs, focus_areas";
function parseProfile(data: {
  interest_programs: unknown;
  focus_areas: unknown;
}) {
  return normalizePreferences({
    programs: data.interest_programs,
    focusAreas: data.focus_areas,
  });
}
export async function loadPreferences(userId: string, signal: AbortSignal) {
  if (!supabase) throw new Error("Auth is not configured.");
  const { data, error } = await supabase
    .from("profiles")
    .select(columns)
    .eq("id", userId)
    .abortSignal(signal)
    .single();
  if (error) throw error;
  return parseProfile(data);
}
export async function savePreferences(
  userId: string,
  value: LearningPreferences,
) {
  if (!supabase) throw new Error("Auth is not configured.");
  const clean = normalizePreferences(value);
  const { data, error } = await supabase
    .from("profiles")
    .update({
      interest_programs: clean.programs,
      focus_areas: clean.focusAreas,
    })
    .eq("id", userId)
    .select(columns)
    .single();
  if (error) throw error;
  return parseProfile(data);
}
