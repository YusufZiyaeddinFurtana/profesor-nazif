/** Only Google appointment pages are allowed as booking targets. No arbitrary iframe URLs. */
export function calendarTarget(
  value: string,
): { url: string; canEmbed: boolean } | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return;
    if (
      url.hostname === "calendar.google.com" &&
      /^\/calendar\/(?:u\/\d+\/)?appointments\/schedules\/[^/]+\/?$/.test(
        url.pathname,
      )
    )
      return { url: url.href, canEmbed: true };
    if (
      url.hostname === "calendar.app.google" &&
      /^\/[A-Za-z0-9_-]+$/.test(url.pathname)
    )
      return { url: url.href, canEmbed: false };
  } catch {
    /* Invalid configured links must not become booking targets. */
  }
}
