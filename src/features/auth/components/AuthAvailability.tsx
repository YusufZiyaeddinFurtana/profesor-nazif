import type { ReactNode } from "react";
import { useAuth } from "../AuthProvider";
import { useLocale } from "../../../i18n/LocaleProvider";
export function AuthAvailability({ children }: { children: ReactNode }) {
  const { status, retry } = useAuth();
  const { t } = useLocale();
  if (status === "unconfigured")
    return (
      <div className="auth-notice">
        <h2>{t("authUnavailable")}</h2>
        <p>{t("authUnavailableDescription")}</p>
        <a className="primary-button" href="/#kategoriler">
          {t("explore")}
        </a>
      </div>
    );
  if (status === "loading") return <p role="status">{t("authLoading")}</p>;
  if (status === "error")
    return (
      <div className="auth-notice" role="alert">
        <h2>{t("authSessionError")}</h2>
        <p>{t("authNetworkError")}</p>
        <button className="secondary-button" type="button" onClick={retry}>
          {t("retry")}
        </button>
      </div>
    );
  return children;
}
