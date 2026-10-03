import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
const storageKey = "nazif-theme-v1";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(
  null,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111c18" : "#f4f0e5");
  }, [theme]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      try {
        if (localStorage.getItem(storageKey)) return;
      } catch {
        /* Storage is optional. */
      }
      setTheme(preference.matches ? "dark" : "light");
    };
    const fromStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      if (event.newValue === "dark" || event.newValue === "light")
        setTheme(event.newValue);
      else sync();
    };
    preference.addEventListener("change", sync);
    window.addEventListener("storage", fromStorage);
    return () => {
      preference.removeEventListener("change", sync);
      window.removeEventListener("storage", fromStorage);
    };
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* Keep the current tab usable. */
    }
  }
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeProvider eksik.");
  return context;
}
