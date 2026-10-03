import type { Lesson } from "../../features/catalog/types";

export function LessonCover({ lesson }: { lesson: Lesson }) {
  if (lesson.image)
    return (
      <div className="lesson-cover lesson-cover--image">
        <img
          src={lesson.image}
          alt={`${lesson.title} için eski eğitim kapağı`}
        />
      </div>
    );
  return (
    <div
      className={`lesson-cover lesson-cover--${lesson.program.toLowerCase()}`}
    >
      <span className="cover-top">
        PROFESÖR NAZİF <span>✳</span> {lesson.program}
      </span>
      <img src="/nazif-portrait.png" alt="" />
      <strong>{lesson.coverLabel}</strong>
      <span className="cover-bottom">
        Cymurghs #7466{!lesson.youtubeVideoId && " · Ders taslağı"}
      </span>
    </div>
  );
}
