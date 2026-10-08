import { useState } from "react";
import { categories } from "../../features/education/data/categories";
import { educationPath } from "../../app/routes";
import { Arrow } from "../ui/Arrow";
import { ThemeToggle } from "../../theme/ThemeToggle";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label="Profesör Nazif ana sayfa">
        <span className="brand-mark">
          <img src="/nazif-portrait.png" alt="" />
        </span>
        <span className="brand-wordmark">
          Profesör <strong>Nazif</strong>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? "Kapat" : "Menü"}
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
      <nav
        id="main-nav"
        className={menuOpen ? "nav-open" : ""}
        aria-label="Ana menü"
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
            event.currentTarget
              .querySelectorAll("details")
              .forEach((item) => item.removeAttribute("open"));
          }
        }}
      >
        <a href="/">Anasayfa</a>
        <a href="/#kategoriler">Eğitimler</a>
        {(["FRC", "FLL"] as const).map((program) => (
          <details className="nav-dropdown" key={program}>
            <summary>
              {program} <span aria-hidden="true">⌄</span>
            </summary>
            <div className="dropdown-panel">
              <a className="dropdown-overview" href={educationPath(program)}>
                {program} eğitimleri <Arrow />
              </a>
              {categories
                .filter((item) => item.program === program)
                .map((item) => (
                  <a href={educationPath(program, item.slug)} key={item.slug}>
                    {item.title}
                  </a>
                ))}
            </div>
          </details>
        ))}
      </nav>
      <ThemeToggle />
      <a className="header-cta" href="/#ozel-ders">
        Özel ders talep et! <Arrow diagonal />
      </a>
    </header>
  );
}
