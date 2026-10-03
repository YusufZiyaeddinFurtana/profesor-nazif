import { courseGroups } from "../../data/siteContent";
import type { Program } from "../../features/catalog/types";
import { Arrow } from "../ui/Arrow";

export function CategoriesSection() {
  return (
    <section
      id="kategoriler"
      className="section-wrap categories-section"
      aria-labelledby="categories-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">DERS DEFTERİ / 01</span>
          <h2 id="categories-title">
            İki program, <em>sekiz öğrenme yolu.</em>
          </h2>
          <p>
            FRC ve FLL için konu gruplarını keşfet. Her grubun altında örnek
            dersler yer alıyor.
          </p>
        </div>
        <span className="hand-annotation">Önce bir kapı seç! ↘</span>
      </div>
      <div className="program-grid">
        {(["FRC", "FLL"] as Program[]).map((item) => (
          <article
            className={`program-panel program-panel--${item.toLowerCase()}`}
            key={item}
          >
            <div className="program-heading">
              <span className="program-index">
                {item === "FRC" ? "01" : "02"} / PROGRAM
              </span>
              <h3>{item}</h3>
              <p>
                {item === "FRC"
                  ? "Robotun sahadaki yolculuğundan takımın sürdürülebilirliğine."
                  : "Bir fikrin robota, projeye ve ekip çalışmasına dönüşmesine."}
              </p>
            </div>
            <div className="program-groups">
              {courseGroups
                .filter((entry) => entry.program === item)
                .map((entry) => (
                  <a
                    key={entry.id}
                    href={`/?program=${item}&group=${encodeURIComponent(entry.title)}#dersler`}
                  >
                    <strong>
                      {entry.title} <Arrow diagonal />
                    </strong>
                    <span>{entry.description}</span>
                  </a>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
