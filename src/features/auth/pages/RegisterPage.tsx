import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useNavigation } from "../../../app/Navigation";
import type { MessageKey } from "../../../i18n/types";
import { useAuth } from "../AuthProvider";
import { authErrorKey, safeReturnPath } from "../authHelpers";
import { register, resendConfirmation } from "../authService";
import { AuthShell } from "../components/AuthShell";
import { AuthAvailability } from "../components/AuthAvailability";
import { PasswordField } from "../components/PasswordField";
import {
  InterestChoices,
  PreferenceSummary,
} from "../../interests/components/InterestChoices";
import {
  emptyPreferences,
  type LearningPreferences,
} from "../../interests/types";

export function RegisterPage() {
  const { t } = useLocale();
  const { session, status } = useAuth();
  const { location, navigate } = useNavigation();
  const next = safeReturnPath(new URLSearchParams(location.search).get("next"));
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] =
    useState<LearningPreferences>(emptyPreferences);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [error, setError] = useState<MessageKey | null>(null);
  const [success, setSuccess] = useState<MessageKey | null>(null);
  const workspace = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = `${t("authRegisterTitle")} — Profesör Nazif`;
  }, [t]);
  useEffect(() => {
    if (status === "ready" && session) navigate(next, true);
  }, [status, session, next, navigate]);
  function goToStep(value: number) {
    setError(null);
    setStep(value);
    requestAnimationFrame(() => workspace.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setSuccess(null);
    if (step < 2) {
      goToStep(step + 1);
      return;
    }
    if (password !== confirmation) {
      setError("authPasswordMismatch");
      return;
    }
    setBusy(true);
    try {
      const data = await register(fullName, email, password, next, preferences);
      if (data.session) navigate(next, true);
      else {
        setAwaitingVerification(true);
        setSuccess("authVerificationDescription");
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
  const steps = [
    "interestsStepProgram",
    "interestsStepFocus",
    "interestsStepAccount",
  ] as const;
  return (
    <AuthShell
      title={t(
        awaitingVerification
          ? "authVerificationTitle"
          : step < 2
            ? "interestsWelcomeTitle"
            : "authRegisterTitle",
      )}
      description={
        awaitingVerification
          ? undefined
          : t(step < 2 ? "interestsWelcomeDescription" : "authRegisterIntro")
      }
    >
      <AuthAvailability>
        <div
          ref={workspace}
          tabIndex={-1}
          className="registration-workspace"
          aria-label={t("registrationProgress")}
        >
          {!awaitingVerification && (
            <ol
              className="registration-steps"
              aria-label={t("registrationProgress")}
            >
              {steps.map((label, index) => (
                <li
                  key={label}
                  aria-current={step === index ? "step" : undefined}
                  data-complete={index < step || undefined}
                >
                  <span aria-hidden="true">{index + 1}</span>
                  {t(label)}
                </li>
              ))}
            </ol>
          )}
          {error && (
            <p className="auth-feedback auth-feedback--error" role="alert">
              {t(error)}
            </p>
          )}
          {success && (
            <p className="auth-feedback" role="status">
              {t(success)}
            </p>
          )}
          {awaitingVerification ? (
            <div className="auth-verification">
              <p>{email}</p>
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={resend}
              >
                {t(busy ? "authBusy" : "authResend")}
              </button>
              <a
                className="text-action"
                href={`/giris?next=${encodeURIComponent(next)}`}
              >
                {t("authLogin")}
              </a>
            </div>
          ) : (
            <form className="auth-form" onSubmit={submit} aria-busy={busy}>
              {step < 2 ? (
                <InterestChoices
                  stage={step === 0 ? "programs" : "focus"}
                  value={preferences}
                  onChange={setPreferences}
                />
              ) : (
                <>
                  <div className="registration-review">
                    <PreferenceSummary value={preferences} />
                    <button
                      className="text-action"
                      type="button"
                      disabled={busy}
                      onClick={() => goToStep(0)}
                    >
                      {t("interestsEdit")}
                    </button>
                  </div>
                  <label className="auth-field">
                    {t("fullName")}
                    <input
                      name="fullName"
                      autoComplete="name"
                      required
                      pattern=".*\S.*"
                      maxLength={120}
                      value={fullName}
                      disabled={busy}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
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
                  <PasswordField
                    value={password}
                    onChange={setPassword}
                    newPassword
                    disabled={busy}
                  />
                  <PasswordField
                    value={confirmation}
                    onChange={setConfirmation}
                    newPassword
                    confirmation
                    disabled={busy}
                  />
                  <p className="auth-field-hint">{t("authPasswordHint")}</p>
                </>
              )}
              <div className="interest-form-actions">
                {step > 0 && (
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => goToStep(step - 1)}
                  >
                    {t("back")}
                  </button>
                )}
                <button
                  className="primary-button auth-submit"
                  type="submit"
                  disabled={busy}
                >
                  {t(
                    busy ? "authBusy" : step < 2 ? "continue" : "authRegister",
                  )}
                </button>
              </div>
              {step < 2 && (
                <button
                  className="interest-skip"
                  type="button"
                  onClick={() => goToStep(2)}
                >
                  {t("interestsSkip")}
                </button>
              )}
              <p className="auth-alternative">
                {t("authHasAccount")}{" "}
                <a href={`/giris?next=${encodeURIComponent(next)}`}>
                  {t("authLogin")}
                </a>
              </p>
            </form>
          )}
        </div>
      </AuthAvailability>
    </AuthShell>
  );
}
