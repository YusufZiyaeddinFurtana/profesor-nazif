import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useAuth } from "../../auth/AuthProvider";
import { AuthShell } from "../../auth/components/AuthShell";
import { AuthAvailability } from "../../auth/components/AuthAvailability";
import { loginPath } from "../../auth/authHelpers";
import { useNavigation } from "../../../app/Navigation";
import { usePreferences } from "../PreferencesProvider";
import { emptyPreferences } from "../types";
import { InterestChoices } from "../components/InterestChoices";

export function InterestsPage() {
  const { t } = useLocale();
  const { session, status: authStatus } = useAuth();
  const { preferences, status, save, retry } = usePreferences();
  const { navigate } = useNavigation();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(emptyPreferences);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const workspace = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = `${t("interestsEdit")} — Profesör Nazif`;
  }, [t]);
  useEffect(() => {
    if (authStatus === "ready" && !session)
      navigate(loginPath("/ilgi-alanlarim"), true);
  }, [authStatus, session, navigate]);
  useEffect(() => {
    if (status === "ready" && !editing) setDraft(preferences);
  }, [status, preferences, editing]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (step === 0) {
      setStep(1);
      requestAnimationFrame(() => workspace.current?.focus());
      return;
    }
    setBusy(true);
    setError(false);
    try {
      await save(draft);
      navigate("/hesabim");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthShell
      title={t("interestsWelcomeTitle")}
      description={t("interestsEditDescription")}
    >
      <AuthAvailability>
        {!session || status === "loading" || status === "idle" ? (
          <p role="status">{t("interestsLoading")}</p>
        ) : status === "error" ? (
          <div role="alert" className="preferences-error">
            <p>{t("interestsLoadError")}</p>
            <button className="secondary-button" type="button" onClick={retry}>
              {t("retry")}
            </button>
            <a className="text-action" href="/hesabim">
              {t("interestsBackAccount")}
            </a>
          </div>
        ) : (
          <div
            ref={workspace}
            tabIndex={-1}
            className="registration-workspace"
            aria-label={t("interestsEdit")}
          >
            <ol className="registration-steps" aria-label={t("interestsEdit")}>
              <li aria-current={step === 0 ? "step" : undefined}>
                <span aria-hidden="true">1</span>
                {t("interestsStepProgram")}
              </li>
              <li aria-current={step === 1 ? "step" : undefined}>
                <span aria-hidden="true">2</span>
                {t("interestsStepFocus")}
              </li>
            </ol>
            {error && (
              <p role="alert" className="auth-feedback auth-feedback--error">
                {t("interestsSaveError")}
              </p>
            )}
            <form className="auth-form" onSubmit={submit} aria-busy={busy}>
              <InterestChoices
                stage={step === 0 ? "programs" : "focus"}
                value={draft}
                onChange={(value) => {
                  setEditing(true);
                  setDraft(value);
                }}
                disabled={busy}
              />
              <div className="interest-form-actions">
                {step > 0 && (
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => setStep(0)}
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
                    busy
                      ? "authBusy"
                      : step === 0
                        ? "continue"
                        : "interestsSave",
                  )}
                </button>
              </div>
              <a className="interest-skip" href="/hesabim">
                {t("interestsCancel")}
              </a>
            </form>
          </div>
        )}
      </AuthAvailability>
    </AuthShell>
  );
}
