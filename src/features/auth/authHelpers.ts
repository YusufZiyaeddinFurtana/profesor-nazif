import type { MessageKey } from "../../i18n/types";
/** Authentication return links stay on this origin and cannot lead back into the auth flow. */
export function safeReturnPath(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return "/hesabim";
  try {
    const url = new URL(value, "https://nazif.invalid");
    if (
      url.origin !== "https://nazif.invalid" ||
      /^\/(?:giris|kayit|sifremi-unuttum|sifre-yenile|auth)(?:\/|$)/.test(
        decodeURIComponent(url.pathname),
      )
    )
      return "/hesabim";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/hesabim";
  }
}
export function loginPath(next: string) {
  return `/giris?next=${encodeURIComponent(safeReturnPath(next))}`;
}
export function authErrorKey(error: unknown): MessageKey {
  const value = error as { code?: string; name?: string; status?: number };
  if (value?.name === "AuthRetryableFetchError" || value?.name === "TypeError")
    return "authNetworkError";
  switch (value?.code) {
    case "invalid_credentials":
      return "authInvalidCredentials";
    case "email_not_confirmed":
      return "authEmailNotConfirmed";
    case "weak_password":
    case "same_password":
      return "authWeakPassword";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "authRateLimit";
    case "otp_expired":
    case "flow_state_expired":
    case "flow_state_not_found":
    case "bad_code_verifier":
      return "authLinkExpired";
    default:
      return "authGenericError";
  }
}
