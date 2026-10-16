import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { AuthAvailability } from "../auth/components/AuthAvailability";
import { loginPath } from "../auth/authHelpers";
import { useNavigation } from "../../app/Navigation";
import { useLocale } from "../../i18n/LocaleProvider";
import { useAdmin } from "./AdminProvider";
import { adminMessages } from "./messages";
import { AdminWorkspace } from "./AdminWorkspace";
export function AdminPage() {
  const { session, status } = useAuth();
  const admin = useAdmin();
  const { navigate } = useNavigation();
  const { locale } = useLocale();
  const copy = adminMessages[locale];
  useEffect(() => {
    document.title = `${copy.title} — Profesör Nazif`;
  }, [copy.title]);
  useEffect(() => {
    if (status === "ready" && !session) navigate(loginPath("/admin"), true);
  }, [session, status, navigate]);
  return (
    <section className="section-wrap admin-page">
      <a className="text-action" href="/hesabim">
        {copy.back}
      </a>
      <header className="admin-heading">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </header>
      <AuthAvailability>
        {session &&
          (admin.status === "loading" ? (
            <p role="status">{copy.loading}</p>
          ) : admin.status === "error" ? (
            <div className="auth-notice" role="alert">
              <p>{copy.error}</p>
              <button className="secondary-button" onClick={admin.retry}>
                {copy.retry}
              </button>
            </div>
          ) : admin.isAdmin ? (
            <AdminWorkspace key={session.user.id} userId={session.user.id} />
          ) : (
            <div className="auth-notice">
              <h2>{copy.forbidden}</h2>
              <p>{copy.forbiddenHelp}</p>
            </div>
          ))}
      </AuthAvailability>
    </section>
  );
}
