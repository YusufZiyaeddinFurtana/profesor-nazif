import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { ChalkNazifArtwork } from "../../../components/branding/ChalkNazifArtwork";

export function HeroSection() {
  const [introCycle, setIntroCycle] = useState(0);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="board-frame">
        <div className="board-inner">
          <div className="hero-content">
            <p className="hero-hand-note">Tahta hazır. Merakını getir!</p>
            <h1 id="hero-title">
              Robotik <span>tahtada</span>
              <br />
              başlar.
            </h1>
            <p className="hero-description">
              FRC ve FLL konularını Profesör Nazif’le adım adım keşfet. Tahtada
              öğrendiğini robotunda dene.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#kategoriler">
                Eğitimleri keşfet <Arrow />
              </a>
              <a className="quiet-link" href="#nasil-calisir">
                Nasıl işler? <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <span className="hero-visual-label">Profesör bugün tahtada</span>
            <div className="hero-nazif-entrance" key={introCycle}>
              <ChalkNazifArtwork animated />
            </div>
            <p>
              “Bugün ne
              <br />
              öğreniyoruz?”
            </p>
            <button
              className="hero-replay"
              type="button"
              onClick={() => setIntroCycle((value) => value + 1)}
            >
              Çizimi yeniden izle <Arrow />
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
