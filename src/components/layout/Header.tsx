import { useState } from "react";
import { frcTopics } from "../../data/siteContent";
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
          <small>Cymurghs #7466</small>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen(!menuOpen)}
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
            event.currentTarget
              .querySelector("details")
              ?.removeAttribute("open");
          }
        }}
      >
        <a href="/" onClick={() => setMenuOpen(false)}>
          Anasayfa
        </a>
        <a href="/#hakkimizda" onClick={() => setMenuOpen(false)}>
          Hakkımızda
        </a>
        <details className="nav-dropdown">
          <summary>
            FRC <span aria-hidden="true">⌄</span>
          </summary>
          <div className="dropdown-panel">
            <p>FRC konu başlıkları</p>
            {frcTopics.map((item) => (
              <a
                href={`/?program=FRC&topic=${encodeURIComponent(item.title)}#dersler`}
                key={item.title}
                onClick={() => setMenuOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </div>
        </details>
        <a href="/?program=FLL#dersler" onClick={() => setMenuOpen(false)}>
          FLL
        </a>
      </nav>
      <ThemeToggle />
      <a className="header-cta" href="/#ozel-ders">
        Özel ders talep et! <Arrow diagonal />
      </a>
    </header>
  );
}
