import { useEffect, useState } from "react";
import { useNavigation } from "../../../app/Navigation";
import { useLocale } from "../../../i18n/LocaleProvider";
import type { MessageKey } from "../../../i18n/types";
import { safeReturnPath, authErrorKey } from "../authHelpers";
import { completeCallback } from "../authService";
import { AuthShell } from "../components/AuthShell";
import { AuthAvailability } from "../components/AuthAvailability";
import { useAuth } from "../AuthProvider";
export function AuthCallbackPage() {
  const { t } = useLocale();
  const { status } = useAuth();
  const { location, navigate } = useNavigation();
  const [params] = useState(() => new URLSearchParams(location.search));
  const [error, setError] = useState<MessageKey | null>(null);
  const code = params.get("code");
  const requested = params.get("next");
  const next =
    requested === "/sifre-yenile" ? requested : safeReturnPath(requested);
  useEffect(() => {
    document.title = `${t("authCallbackTitle")} — Profesör Nazif`;
  }, [t]);
  useEffect(() => {
    if (status === "unconfigured") return;
    if (!code || params.has("error")) {
      setError("authLinkExpired");
      window.history.replaceState(null, "", "/auth/callback");
      return;
    }
    let active = true;
    void completeCallback(code)
      .then(({ error }) => {
        if (!active) return;
        if (error) {
          setError(authErrorKey(error));
          window.history.replaceState(null, "", "/auth/callback");
        } else navigate(next, true);
      })
      .catch((e) => {
        if (active) {
          setError(authErrorKey(e));
          window.history.replaceState(null, "", "/auth/callback");
        }
      });
    return () => {
      active = false;
    };
  }, [code, params, next, navigate, status === "unconfigured"]);
  return (
    <AuthShell
      title={t("authCallbackTitle")}
      description={t("authCallbackDescription")}
    >
      <AuthAvailability>
        {error ? (
          <div className="auth-notice" role="alert">
            <p>{t(error)}</p>
            <a className="text-action" href="/sifremi-unuttum">
              {t("authSendReset")}
            </a>
            <a className="text-action" href="/giris">
              {t("authLogin")}
            </a>
          </div>
        ) : (
          <p role="status">{t("authLoading")}</p>
        )}
      </AuthAvailability>
    </AuthShell>
  );
}
