export type SupabaseConfig = { url: string; key: string };
/** Accept only browser-safe publishable or legacy anon keys. Never secret/service_role keys. */
export function readSupabaseConfig(
  urlValue?: string,
  keyValue?: string,
): SupabaseConfig | undefined {
  const url = urlValue?.trim(),
    key = keyValue?.trim();
  if (!url && !key) return;
  if (!url || !key)
    throw new Error(
      "Supabase URL and publishable key must be supplied together.",
    );
  const parsed = new URL(url);
  if (
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    !["", "/"].includes(parsed.pathname) ||
    (parsed.protocol !== "https:" &&
      !(
        parsed.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(parsed.hostname)
      ))
  )
    throw new Error("Invalid Supabase URL.");
  let isAnon = false;
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(
        atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      isAnon = payload.role === "anon";
    } catch {
      /* Invalid legacy key. */
    }
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key) && !isAnon)
    throw new Error(
      "Only a publishable or legacy anon key may be used by the frontend.",
    );
  return { url: parsed.origin, key };
}
