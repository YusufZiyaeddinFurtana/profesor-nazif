import { useState } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useLearning } from "../LearningProvider";
import { exerciseDownload } from "../learningService";
import type { LessonMaterial } from "../types";
export function LessonExercise({ material }: { material?: LessonMaterial }) {
  const { t } = useLocale();
  const { progress, markExercise } = useLearning();
  const completed = progress.find(
    (p) => p.lesson_id === material?.lesson_id,
  )?.exercise_completed_at;
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  async function act(action: "download" | "complete") {
    if (!material) return;
    setBusy(true);
    setError(false);
    try {
      if (action === "download") {
        const url = await exerciseDownload(material.exercise_path);
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.append(link);
        link.click();
        link.remove();
      } else await markExercise(material.lesson_id);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="lesson-exercise" aria-labelledby="exercise-title">
      <h2 id="exercise-title">{t("exerciseTitle")}</h2>
      <p>{t(material ? "exerciseDescription" : "exercisePending")}</p>
      {material && (
        <div className="exercise-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={busy}
            onClick={() => void act("download")}
          >
            {t("exerciseDownload")}
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={busy || !!completed}
            onClick={() => void act("complete")}
          >
            {t(
              completed
                ? "exerciseCompleted"
                : busy
                  ? "authBusy"
                  : "exerciseMarkComplete",
            )}
          </button>
        </div>
      )}
      {error && (
        <p className="learning-error" role="alert">
          {t("exerciseError")}
        </p>
      )}
      {completed && <p role="status">{t("exerciseSaved")}</p>}
    </section>
  );
}
