import { AuthNav } from "../../features/auth/components/AuthNav";
import { useState } from "react";
import { useLocale } from "../../i18n/LocaleProvider";
import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";
import { localizeCategory } from "../../i18n/content/categories";
import { categories } from "../../features/education/data/categories";
import { programs } from "../../features/catalog/types";
import { educationPath } from "../../app/routes";
import { Arrow } from "../ui/Arrow";
import { BrandLogo } from "../branding/BrandLogo";
import { ThemeToggle } from "../../theme/ThemeToggle";
export function Header() {
  const { locale, t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label={t("homeLabel")}>
        <BrandLogo />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {t(menuOpen ? "close" : "menu")}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d={menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
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
        <a href="/egitmenler">{t("instructors")}</a>
        {programs.map((program) => (
          <details className="nav-dropdown" key={program}>
            <summary>
              {program}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m4 6 4 4 4-4" />
              </svg>
            </summary>
            <div className="dropdown-panel">
              {categories
                .filter((c) => c.program === program)
                .map((c) => localizeCategory(c, locale))
                .map((c) => (
                  <a href={educationPath(program, c.slug)} key={c.slug}>
                    {c.title}
                  </a>
                ))}
            </div>
          </details>
        ))}
      </nav>
      <div className="header-preferences">
        <LanguageSwitcher />
        <ThemeToggle />
        <AuthNav />
      </div>
      <a className="header-cta" href="/ozel-ders">
        {t("requestLesson")}
        <Arrow diagonal />
      </a>
    </header>
  );
}
