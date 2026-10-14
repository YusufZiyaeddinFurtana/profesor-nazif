import { supabase } from "../../lib/supabase";
function client() {
  if (!supabase) throw new Error("Auth is not configured.");
  return supabase;
}
function callbackUrl(next: string) {
  const url = new URL("/auth/callback", window.location.origin);
  url.searchParams.set("next", next);
  return url.href;
}
export async function signIn(email: string, password: string) {
  const { data, error } = await client().auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}
export async function register(
  fullName: string,
  email: string,
  password: string,
  next: string,
) {
  const { data, error } = await client().auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: callbackUrl(next),
    },
  });
  if (error) throw error;
  return data;
}
export async function signOut() {
  const { error } = await client().auth.signOut({ scope: "local" });
  if (error) throw error;
}
export async function requestPasswordReset(email: string) {
  const { error } = await client().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: callbackUrl("/sifre-yenile"),
  });
  if (error) throw error;
}
export async function updatePassword(password: string) {
  const { error } = await client().auth.updateUser({ password });
  if (error) throw error;
}
export async function resendConfirmation(email: string, next: string) {
  const { error } = await client().auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: callbackUrl(next) },
  });
  if (error) throw error;
}
// A PKCE code is single-use. Deduplicate the StrictMode effect replay for the current callback.
let lastCode: string | undefined;
let exchange:
  | ReturnType<NonNullable<typeof supabase>["auth"]["exchangeCodeForSession"]>
  | undefined;
export function completeCallback(code: string) {
  if (code !== lastCode || !exchange) {
    lastCode = code;
    exchange = client().auth.exchangeCodeForSession(code);
  }
  return exchange;
}
