import { useState } from "react";
import type { Lesson } from "../../features/catalog/types";
import { LessonCover } from "./LessonCover";

export function YouTubePlayer({ lesson }: { lesson: Lesson }) {
  const [playing, setPlaying] = useState(false);
  const videoId = lesson.youtubeVideoId;
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return (
      <div className="video-placeholder">
        <LessonCover lesson={lesson} />
        <span>Eğitim videosu hazırlanıyor</span>
      </div>
    );
  }
  return (
    <div className="youtube-player">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={lesson.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="youtube-start"
          onClick={() => setPlaying(true)}
        >
          <LessonCover lesson={lesson} />
          <span>Videoyu YouTube oynatıcısında aç</span>
        </button>
      )}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
      >
        YouTube’da izle ↗
      </a>
    </div>
  );
}
