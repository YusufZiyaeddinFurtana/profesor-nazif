import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { useLearning } from "../LearningProvider";
import { loadYouTube, type YouTubePlayer } from "../youtube";
import { watchedInterval, type LessonMaterial } from "../types";
export function TrackedVideo({
  material,
  title,
}: {
  material: LessonMaterial;
  title: string;
}) {
  const { t } = useLocale();
  const { saveWatch } = useLearning();
  const slot = useRef<HTMLDivElement>(null),
    queue = useRef<[number, number][]>([]),
    saving = useRef(false),
    mounted = useRef(true);
  const save = useRef(saveWatch);
  save.current = saveWatch;
  const titleRef = useRef(title);
  titleRef.current = title;
  useEffect(() => {
    slot.current?.querySelector("iframe")?.setAttribute("title", title);
  }, [title]);
  const [error, setError] = useState(false),
    [saveError, setSaveError] = useState(false),
    [attempt, setAttempt] = useState(0),
    [ready, setReady] = useState(false);
  const flush = useCallback(async () => {
    if (saving.current) return;
    saving.current = true;
    try {
      while (queue.current.length) {
        const interval = queue.current.shift()!;
        try {
          await save.current(material.lesson_id, ...interval);
        } catch (error) {
          queue.current.unshift(interval);
          throw error;
        }
      }
      if (mounted.current) setSaveError(false);
    } catch {
      if (mounted.current) setSaveError(true);
    } finally {
      saving.current = false;
    }
  }, [material.lesson_id]);
  useEffect(() => {
    mounted.current = true;
    let active = true,
      player: YouTubePlayer | undefined,
      last: { time: number; wall: number } | undefined;
    let timer: number | undefined, flushTimer: number | undefined;
    setError(false);
    setReady(false);
    const sample = (finishing = false) => {
      if (
        !player ||
        typeof player.getCurrentTime !== "function" ||
        typeof player.getPlayerState !== "function"
      )
        return;
      const time = player.getCurrentTime(),
        wall = performance.now();
      if (player.getPlayerState() === 1 || (finishing && last)) {
        if (last) {
          const interval = watchedInterval(
            last.time,
            Math.min(time, material.video_duration_seconds),
            (wall - last.wall) / 1000,
            player.getPlaybackRate(),
          );
          if (interval) {
            const tail = queue.current.at(-1);
            if (tail && tail[1] === interval[0] && interval[1] - tail[0] <= 15)
              tail[1] = interval[1];
            else queue.current.push(interval);
          }
        }
        last = { time, wall };
      } else last = undefined;
    };
    void loadYouTube()
      .then((api) => {
        if (!active || !slot.current) return;
        const element = document.createElement("div");
        slot.current.replaceChildren(element);
        player = new api.Player(element, {
          videoId: material.youtube_video_id,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: {
            playsinline: 1,
            origin: window.location.origin,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (!active) return;
              setReady(true);
              const frame = slot.current?.querySelector("iframe");
              frame?.setAttribute("title", titleRef.current);
              timer = window.setInterval(() => sample(), 1000);
              flushTimer = window.setInterval(() => {
                void flush();
              }, 5000);
            },
            onStateChange: (event) => {
              sample(event.data === 0 || event.data === 2);
              if (
                event.data === 1 &&
                player &&
                typeof player.getCurrentTime === "function"
              )
                last = {
                  time: player.getCurrentTime(),
                  wall: performance.now(),
                };
              else {
                last = undefined;
                void flush();
              }
            },
            onError: () => {
              if (active) setError(true);
            },
          },
        });
      })
      .catch(() => {
        if (active) setError(true);
      });
    const visibility = () => {
      if (document.hidden) {
        sample();
        last = undefined;
        void flush();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active = false;
      sample();
      mounted.current = false;
      window.clearInterval(timer);
      window.clearInterval(flushTimer);
      document.removeEventListener("visibilitychange", visibility);
      player?.destroy();
      void flush();
    };
  }, [
    material.lesson_id,
    material.youtube_video_id,
    material.video_duration_seconds,
    attempt,
    flush,
  ]);
  return (
    <>
      <div className="tracked-player" hidden={error}>
        <div ref={slot} />
      </div>
      {!ready && !error && <p role="status">{t("videoLoading")}</p>}
      {error && (
        <div className="learning-notice" role="alert">
          <p>{t("videoLoadError")}</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setAttempt((v) => v + 1)}
          >
            {t("retry")}
          </button>
        </div>
      )}
      {saveError && (
        <div className="learning-notice" role="alert">
          <p>{t("progressSaveError")}</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => void flush()}
          >
            {t("retry")}
          </button>
        </div>
      )}
    </>
  );
}
