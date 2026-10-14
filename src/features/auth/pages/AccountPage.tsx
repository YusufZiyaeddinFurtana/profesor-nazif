import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useNavigation } from "../../../app/Navigation";
import { loginPath, authErrorKey } from "../authHelpers";
import { signOut } from "../authService";
import type { MessageKey } from "../../../i18n/types";
import { AuthAvailability } from "../components/AuthAvailability";
import { programs } from "../../catalog/types";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";
export function AccountPage() {
  const { t } = useLocale();
  const { session, status } = useAuth();
  const { navigate } = useNavigation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<MessageKey | null>(null);
  useEffect(() => {
    document.title = `${t("authAccount")} — Profesör Nazif`;
  }, [t]);
  useEffect(() => {
    if (status === "ready" && !session) navigate(loginPath("/hesabim"), true);
  }, [session, status, navigate]);
  async function logout() {
    setBusy(true);
    setError(null);
    try {
      await signOut();
      navigate("/", true);
    } catch (e) {
      setError(authErrorKey(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section-wrap account-page">
      <h1>{t("authAccountTitle")}</h1>
      <AuthAvailability>
        {session ? (
          <>
            <p className="account-intro">{t("authAccountIntro")}</p>
            <dl className="account-details">
              <div>
                <dt>{t("fullName")}</dt>
                <dd>
                  {typeof session.user.user_metadata.full_name === "string"
                    ? session.user.user_metadata.full_name
                    : t("authStudent")}
                </dd>
              </div>
              <div>
                <dt>{t("email")}</dt>
                <dd>{session.user.email}</dd>
              </div>
            </dl>
            <div className="account-programs">
              {programs.map((program) => (
                <a key={program} href={educationPath(program)}>
                  <strong>{program}</strong>
                  <span>{t("programCourses", { program })}</span>
                  <Arrow diagonal />
                </a>
              ))}
            </div>
            {error && (
              <p className="auth-feedback auth-feedback--error" role="alert">
                {t(error)}
              </p>
            )}
            <div className="account-actions">
              <a className="text-action" href="/sifremi-unuttum">
                {t("authResetTitle")}
              </a>
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={logout}
              >
                {t(busy ? "authBusy" : "authLogout")}
              </button>
            </div>
          </>
        ) : (
          <p role="status">{t("authLoading")}</p>
        )}
      </AuthAvailability>
    </section>
  );
}
