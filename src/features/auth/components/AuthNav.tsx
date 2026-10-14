import { useAuth } from "../AuthProvider";
import { useLocale } from "../../../i18n/LocaleProvider";
export function AuthNav() {
  const { session } = useAuth();
  const { t } = useLocale();
  return (
    <a className="header-account" href={session ? "/hesabim" : "/giris"}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </svg>
      {t(session ? "authAccount" : "authLogin")}
    </a>
  );
}
