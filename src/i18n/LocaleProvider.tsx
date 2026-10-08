import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale, MessageKey } from "./types";
import { isLocale, languageStorageKey, translate } from "./translate";
function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (isLocale(saved)) return saved;
  } catch {
    /* Storage may be disabled. */
  }
  return "tr";
}
type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );
  useEffect(() => {
    document.documentElement.lang = locale;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("metaDescription"));
    try {
      localStorage.setItem(languageStorageKey, locale);
    } catch {
      /* Switching still works without storage. */
    }
  }, [locale, t]);
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale requires LocaleProvider");
  return context;
}
