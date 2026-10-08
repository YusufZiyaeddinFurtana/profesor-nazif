import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";
import { localizeCategory } from "../../i18n/content/categories";
import { useLocale } from "../../i18n/LocaleProvider";
import { useState } from "react";
import { categories } from "../../features/education/data/categories";
import { educationPath } from "../../app/routes";
import { Arrow } from "../ui/Arrow";
import { ThemeToggle } from "../../theme/ThemeToggle";

export function Header() {
  const { locale, t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label={t("homeLabel")}>
        <span className="brand-mark">
          <img src="/nazif-portrait.png" alt="" />
        </span>
        <span className="brand-wordmark">
          <strong>{t("brand")}</strong>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((value) => !value)}
      >
        {t(menuOpen ? "close" : "menu")}
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
      <nav
        id="main-nav"
        className={menuOpen ? "nav-open" : ""}
        aria-label={t("mainNav")}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
            event.currentTarget
              .querySelectorAll("details")
              .forEach((item) => item.removeAttribute("open"));
          }
        }}
      >
        <a href="/">{t("home")}</a>
        <a href="/#kategoriler">{t("courses")}</a>
        {(["FRC", "FLL"] as const).map((program) => (
          <details className="nav-dropdown" key={program}>
            <summary>
              {program} <span aria-hidden="true">⌄</span>
            </summary>
            <div className="dropdown-panel">
              <a className="dropdown-overview" href={educationPath(program)}>
                {t("programCourses", { program })} <Arrow />
              </a>
              {categories
                .filter((item) => item.program === program)
                .map((item) => localizeCategory(item, locale))
                .map((item) => (
                  <a href={educationPath(program, item.slug)} key={item.slug}>
                    {item.title}
                  </a>
                ))}
            </div>
          </details>
        ))}
      </nav>
      <div className="header-preferences">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <a className="header-cta" href="/#ozel-ders">
        {t("requestLesson")} <Arrow diagonal />
      </a>
    </header>
  );
}
