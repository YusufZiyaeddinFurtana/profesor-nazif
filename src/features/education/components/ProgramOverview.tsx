import type { Program } from "../../catalog/types";
import { categories } from "../data/categories";
import { educationPath } from "../../../app/routes";
import { Arrow } from "../../../components/ui/Arrow";

export function ProgramOverview({ program }: { program: Program }) {
  return (
    <article className="program-overview">
      <h1>{program} eğitimleri</h1>
      <p className="education-lead">
        {program === "FRC"
          ? "Robotun mekanik yapısından yazılımına, elektronik bağlantılardan takım yönetimine: öğrenmek istediğin alanı seç."
          : "Robot yapımı, programlama, özdeğerler ve proje geliştirme: birlikte öğrenmeye bir alandan başla."}
      </p>
      <div className="program-directory">
        {categories
          .filter((item) => item.program === program)
          .map((item) => (
            <a href={educationPath(program, item.slug)} key={item.slug}>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <Arrow diagonal />
            </a>
          ))}
      </div>
    </article>
  );
}
