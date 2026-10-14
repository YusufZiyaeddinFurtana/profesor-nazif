import { useLocale } from "../../../i18n/LocaleProvider";
import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { ChalkNazifArtwork } from "../../../components/branding/ChalkNazifArtwork";

export function HeroSection() {
  const { t } = useLocale();
  const [introCycle, setIntroCycle] = useState(0);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="board-frame">
        <div className="board-inner">
          <div className="hero-content">
            <h1 id="hero-title">
              {t("heroStart")} <span>{t("heroAccent")}</span>
              <span className="hero-motto-end">{t("heroEnd")}</span>
            </h1>
            <p className="hero-description">{t("heroDescription")}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#kategoriler">
                {t("explore")} <Arrow />
              </a>
              <a className="quiet-link" href="#nasil-calisir">
                {t("how")} <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <span className="hero-visual-label">{t("heroVisual")}</span>
            <div className="hero-nazif-entrance" key={introCycle}>
              <ChalkNazifArtwork animated />
            </div>
            <button
              className="hero-replay"
              type="button"
              onClick={() => setIntroCycle((value) => value + 1)}
            >
              {t("replayDrawing")} <Arrow />
            </button>
            <span className="hero-star" aria-hidden="true">
              ✳
            </span>
          </div>
        </div>
        <div className="board-tray" aria-hidden="true">
          <span className="chalk-piece chalk-piece--white" />
          <span className="chalk-piece chalk-piece--yellow" />
          <span className="board-eraser" />
        </div>
      </div>
    </section>
  );
}
