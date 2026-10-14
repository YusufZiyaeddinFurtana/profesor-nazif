import test from "node:test";
import assert from "node:assert/strict";
import { readSupabaseConfig } from "../src/features/auth/authConfig.ts";
import {
  safeReturnPath,
  loginPath,
  authErrorKey,
} from "../src/features/auth/authHelpers.ts";
import { resolveRoute } from "../src/app/routes.ts";
const jwt = (role: string) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ role }))}.signature`;
test("only public Supabase keys and valid origins reach the browser client", () => {
  assert.equal(readSupabaseConfig(), undefined);
  assert.equal(
    readSupabaseConfig("https://example.supabase.co/", "sb_publishable_test")
      ?.url,
    "https://example.supabase.co",
  );
  assert.equal(
    readSupabaseConfig("http://127.0.0.1:54321", jwt("anon"))?.key,
    jwt("anon"),
  );
  for (const [url, key] of [
    ["https://example.supabase.co", "sb_secret_test"],
    ["https://example.supabase.co", jwt("service_role")],
    ["http://evil.test", "sb_publishable_test"],
    ["https://user@evil.test", "sb_publishable_test"],
    ["https://example.supabase.co/path", "sb_publishable_test"],
    ["https://example.supabase.co", ""],
    ["", "sb_publishable_test"],
  ])
    assert.throws(() => readSupabaseConfig(url, key));
});
test("return paths cannot escape the site or loop into auth routes", () => {
  for (const value of [
    null,
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/\nevil.test",
    "/giris",
    "/giris?next=/giris",
    "/%67iris",
    "/auth/callback",
    "/%E0%A4%A",
  ])
    assert.equal(safeReturnPath(value), "/hesabim", String(value));
  const lesson = "/egitimler/frc/programming/wpilib-java";
  assert.equal(safeReturnPath(lesson), lesson);
  assert.equal(
    new URL(loginPath(lesson), "https://site.test").searchParams.get("next"),
    lesson,
  );
});
test("all auth routes have explicit page modes", () => {
  for (const [path, mode] of [
    ["giris", "login"],
    ["kayit", "register"],
    ["sifremi-unuttum", "forgot"],
    ["sifre-yenile", "reset"],
  ])
    assert.deepEqual(resolveRoute("/" + path), { kind: "auth", mode });
  assert.deepEqual(resolveRoute("/auth/callback"), { kind: "auth-callback" });
  assert.deepEqual(resolveRoute("/hesabim"), { kind: "account" });
  assert.equal(resolveRoute("/auth/callback/extra").kind, "not-found");
});
test("auth errors become localizable messages without exposing raw server output", () => {
  assert.equal(
    authErrorKey({ code: "invalid_credentials" }),
    "authInvalidCredentials",
  );
  assert.equal(
    authErrorKey({ code: "email_not_confirmed" }),
    "authEmailNotConfirmed",
  );
  assert.equal(
    authErrorKey({ code: "over_email_send_rate_limit" }),
    "authRateLimit",
  );
  assert.equal(
    authErrorKey({ name: "AuthRetryableFetchError" }),
    "authNetworkError",
  );
  assert.equal(
    authErrorKey({ message: "sensitive error details" }),
    "authGenericError",
  );
});
