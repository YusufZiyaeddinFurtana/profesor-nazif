import { useLocale } from "../../../i18n/LocaleProvider";
import { useState } from "react";
import { ChalkNazifArtwork } from "../../../components/branding/ChalkNazifArtwork";
import { Arrow } from "../../../components/ui/Arrow";

/** The original chalk artwork and reveal timing are shared with the homepage. */
export function LessonIntro({ title }: { title: string }) {
  const { t } = useLocale();
  const [cycle, setCycle] = useState(0);
  return (
    <div className="lesson-intro">
      <div className="intro-preview" key={cycle}>
        <ChalkNazifArtwork animated />
        <span>{title}</span>
      </div>
      <button
        className="intro-replay"
        type="button"
        onClick={() => setCycle((value) => value + 1)}
      >
        {t("replayIntro")} <Arrow />
      </button>
    </div>
  );
}
