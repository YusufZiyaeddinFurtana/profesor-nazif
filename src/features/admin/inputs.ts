/** Extract a YouTube ID, never render pasted HTML. Exact hosts only. */
export function youtubeId(value: string): string | undefined {
  let source = value.trim();
  if (/^[\w-]{11}$/.test(source)) return source;
  if (source.startsWith("<")) {
    if (!/^<iframe\b/i.test(source)) return;
    const matches = [...source.matchAll(/\bsrc\s*=\s*(["'])(.*?)\1/gi)];
    if (matches.length !== 1) return;
    source = matches[0][2];
  }
  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return;
    const host = url.hostname.toLowerCase();
    let id: string | null | undefined;
    if (host === "youtu.be") id = url.pathname.slice(1);
    else if (
      [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "www.youtube-nocookie.com",
        "youtube-nocookie.com",
      ].includes(host)
    ) {
      id =
        url.pathname === "/watch"
          ? url.searchParams.get("v")
          : /^\/(embed|shorts)\/([\w-]{11})\/?$/.exec(url.pathname)?.[2];
    }
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch {
    return;
  }
}
export function durationSeconds(value: string): number | undefined {
  if (!/^\d{1,5}$|^\d{1,3}:\d{2}$|^\d{1,2}:\d{2}:\d{2}$/.test(value.trim()))
    return;
  const parts = value.trim().split(":").map(Number);
  if (parts.length > 1 && parts.slice(1).some((n) => n > 59)) return;
  const total = parts.reduce((sum, n) => sum * 60 + n, 0);
  return total >= 1 && total <= 86400 ? total : undefined;
}
export function durationText(seconds: number | null): string {
  if (!seconds) return "";
  const minutes = Math.floor(seconds / 60),
    tail = String(seconds % 60).padStart(2, "0");
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${tail}`
    : `${minutes}:${tail}`;
}
export async function isPdf(file: File): Promise<boolean> {
  if (
    file.size < 5 ||
    file.size > 10 * 1024 * 1024 ||
    !/\.pdf$/i.test(file.name)
  )
    return false;
  return (
    new TextDecoder().decode(await file.slice(0, 5).arrayBuffer()) === "%PDF-"
  );
}
