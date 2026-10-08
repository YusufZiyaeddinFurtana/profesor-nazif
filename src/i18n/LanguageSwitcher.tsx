import { useLocale } from "./LocaleProvider";
import { isLocale } from "./translate";
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return (
    <label className="language-switcher">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 7h14M5 17h14" />
      </svg>
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(event) => {
          if (isLocale(event.target.value)) setLocale(event.target.value);
        }}
      >
        <option value="tr" lang="tr">
          Türkçe
        </option>
        <option value="en" lang="en">
          English
        </option>
        <option value="zh-Hans" lang="zh-Hans">
          简体中文
        </option>
        <option value="hil" lang="hil">
          Hiligaynon
        </option>
      </select>
    </label>
  );
}
