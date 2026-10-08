import { courseGroups } from "../../education/data/categories";
import { educationPath } from "../../../app/routes";
import type { Program } from "../../catalog/types";
import { Arrow } from "../../../components/ui/Arrow";

export function CategoriesSection() {
  return (
    <section
      id="kategoriler"
      className="section-wrap categories-section"
      aria-labelledby="categories-title"
    >
      <div className="section-heading">
        <div>
          <h2 id="categories-title">
            İki program, <em>sekiz öğrenme yolu.</em>
          </h2>
          <p>Bir alan seç, konuyu tanı ve ders menüsünden öğrenmeye başla.</p>
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
                    href={educationPath(item, entry.categorySlug)}
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
