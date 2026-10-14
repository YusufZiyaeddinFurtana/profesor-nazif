import { useEffect, useState, type FormEvent } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import type { MessageKey } from "../../../i18n/types";
import { useNavigation } from "../../../app/Navigation";
import { useAuth } from "../AuthProvider";
import { authErrorKey, safeReturnPath } from "../authHelpers";
import {
  signIn,
  requestPasswordReset,
  updatePassword,
  resendConfirmation,
} from "../authService";
import { AuthShell } from "../components/AuthShell";
import { AuthAvailability } from "../components/AuthAvailability";
import { PasswordField } from "../components/PasswordField";
import { RegisterPage } from "./RegisterPage";
export type AuthMode = "login" | "register" | "forgot" | "reset";
export function AuthPage({ mode }: { mode: AuthMode }) {
  return mode === "register" ? <RegisterPage /> : <AuthFormPage mode={mode} />;
}
function AuthFormPage({ mode }: { mode: Exclude<AuthMode, "register"> }) {
  const { t } = useLocale();
  const { session, status } = useAuth();
  const { location, navigate } = useNavigation();
  const next = safeReturnPath(new URLSearchParams(location.search).get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<MessageKey | null>(null);
  const [success, setSuccess] = useState<MessageKey | null>(null);
  const titleKey =
    mode === "login"
      ? "authLoginTitle"
      : mode === "forgot"
        ? "authResetTitle"
        : "authNewPasswordTitle";
  const descriptionKey = mode === "forgot" ? "authResetIntro" : "authIntro";
  useEffect(() => {
    document.title = `${t(titleKey)} — Profesör Nazif`;
  }, [t, titleKey]);
  useEffect(() => {
    if (status === "ready" && session && mode === "login") navigate(next, true);
  }, [status, session, mode, next, navigate]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setSuccess(null);
    if (mode === "reset" && password !== confirmation) {
      setError("authPasswordMismatch");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate(next, true);
      } else if (mode === "forgot") {
        await requestPasswordReset(email);
        setSuccess("authResetSent");
      } else {
        await updatePassword(password);
        setSuccess("authPasswordSaved");
      }
    } catch (e) {
      setError(authErrorKey(e));
    } finally {
      setBusy(false);
      setPassword("");
      setConfirmation("");
    }
  }
  async function resend() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await resendConfirmation(email, next);
      setSuccess("authEmailSent");
    } catch (e) {
      setError(authErrorKey(e));
    } finally {
      setBusy(false);
    }
  }
  const action =
    mode === "login"
      ? "authLogin"
      : mode === "forgot"
        ? "authSendReset"
        : "authSavePassword";
  return (
    <AuthShell title={t(titleKey)} description={t(descriptionKey)}>
      <AuthAvailability>
        {mode === "reset" && !session ? (
          <div className="auth-notice">
            <h2>{t("authLinkExpired")}</h2>
            <a className="text-action" href="/sifremi-unuttum">
              {t("authSendReset")}
            </a>
          </div>
        ) : (
          <>
            {error && (
              <p className="auth-feedback auth-feedback--error" role="alert">
                {t(error)}
              </p>
            )}
            {error === "authEmailNotConfirmed" && mode === "login" && (
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={resend}
              >
                {t(busy ? "authBusy" : "authResend")}
              </button>
            )}
            {success && (
              <p className="auth-feedback" role="status">
                {t(success)}
              </p>
            )}
            {success && mode === "reset" ? (
              <a className="primary-button" href="/hesabim">
                {t("authAccount")}
              </a>
            ) : (
              <form onSubmit={submit} className="auth-form" aria-busy={busy}>
                {mode !== "reset" && (
                  <label className="auth-field">
                    {t("email")}
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      disabled={busy}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                )}
                {mode !== "forgot" && (
                  <PasswordField
                    value={password}
                    onChange={setPassword}
                    newPassword={mode !== "login"}
                    disabled={busy}
                  />
                )}
                {mode === "reset" && (
                  <>
                    <PasswordField
                      value={confirmation}
                      onChange={setConfirmation}
                      confirmation
                      newPassword
                      disabled={busy}
                    />
                    <p className="auth-field-hint">{t("authPasswordHint")}</p>
                  </>
                )}
                {mode === "login" && (
                  <a className="auth-forgot" href="/sifremi-unuttum">
                    {t("authForgot")}
                  </a>
                )}
                <button
                  className="primary-button auth-submit"
                  type="submit"
                  disabled={busy}
                >
                  {t(busy ? "authBusy" : action)}
                </button>
                {mode === "login" && (
                  <p className="auth-alternative">
                    {t("authNoAccount")}{" "}
                    <a href={`/kayit?next=${encodeURIComponent(next)}`}>
                      {t("authRegister")}
                    </a>
                  </p>
                )}
                {mode === "forgot" && (
                  <a className="text-action" href="/giris">
                    {t("authLogin")}
                  </a>
                )}
              </form>
            )}
          </>
        )}
      </AuthAvailability>
    </AuthShell>
  );
}
