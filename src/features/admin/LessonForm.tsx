import { useRef, useState, type FormEvent } from "react";
import { educationPath } from "../../app/routes";
import { useLocale } from "../../i18n/LocaleProvider";
import { localizeCategory } from "../../i18n/content/categories";
import { categories } from "../education/data/categories";
import { saveLesson, uploadPdf } from "./adminService";
import { adminMessages } from "./messages";
import { durationSeconds, durationText, isPdf, youtubeId } from "./inputs";
import type { AdminLesson, LessonInput } from "./types";
export function LessonForm({
  lesson,
  userId,
  isCurrent,
  onDirty,
  onSaved,
}: {
  lesson: AdminLesson | null;
  userId: string;
  isCurrent: () => boolean;
  onDirty: (value: boolean) => void;
  onSaved: (id: string) => Promise<void>;
}) {
  const { locale } = useLocale();
  const copy = adminMessages[locale];
  const [id] = useState(() => lesson?.id ?? `lesson-${crypto.randomUUID()}`);
  const [course, setCourse] = useState(lesson?.course_id ?? "fll/programlama");
  const [title, setTitle] = useState(lesson?.title ?? ""),
    [summary, setSummary] = useState(lesson?.summary ?? ""),
    [description, setDescription] = useState(lesson?.long_description ?? "");
  const [video, setVideo] = useState(
      lesson?.youtube_video_id
        ? `https://www.youtube.com/watch?v=${lesson.youtube_video_id}`
        : "",
    ),
    [duration, setDuration] = useState(
      durationText(lesson?.video_duration_seconds ?? null),
    ),
    [order, setOrder] = useState(String(lesson?.sort_order ?? 0));
  const [file, setFile] = useState<File | null>(null),
    [path, setPath] = useState(lesson?.exercise_path ?? null);
  const uploaded = useRef<{ file: File; path: string } | null>(null);
  const [busy, setBusy] = useState<"uploading" | "saving" | null>(null),
    [error, setError] = useState<string | null>(null),
    [success, setSuccess] = useState<"saved" | "live" | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  // Acknowledged saves update the version token without erasing the success message.
  const version = useRef(lesson?.updated_at ?? null);
  version.current = lesson?.updated_at ?? version.current;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    setError(null);
    setSuccess(null);
    const publish =
      (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ===
      "publish";
    const videoId = video.trim() ? youtubeId(video) : undefined;
    const seconds = duration.trim() ? durationSeconds(duration) : undefined;
    const fail = (message: string) => {
      setError(message);
      requestAnimationFrame(() => feedback.current?.focus());
    };
    if (video.trim() && !videoId) return fail(copy.invalidVideo);
    if (duration.trim() && !seconds) return fail(copy.invalidDuration);
    if (publish && (!videoId || !seconds || (!file && !path)))
      return fail(copy.requiredMedia);
    lock.current = true;
    setBusy("saving");
    try {
      let pdfPath = path;
      if (file) {
        if (!(await isPdf(file))) {
          fail(copy.invalidPdf);
          return;
        }
        if (!isCurrent()) return;
        if (uploaded.current?.file === file) pdfPath = uploaded.current.path;
        else {
          setBusy("uploading");
          pdfPath = await uploadPdf(userId, file);
          uploaded.current = { file, path: pdfPath };
        }
        if (!isCurrent()) return;
        setPath(pdfPath);
      }
      setBusy("saving");
      if (!isCurrent()) return;
      const input: LessonInput = {
        id,
        courseId: course,
        title: title.trim(),
        summary: summary.trim(),
        longDescription: description.trim(),
        videoId: videoId ?? null,
        duration: seconds ?? null,
        exercisePath: pdfPath,
        sortOrder: Number(order),
        publish,
        expectedUpdatedAt: version.current,
      };
      await saveLesson(input);
      if (!isCurrent()) return;
      // Persisted success remains true even if refreshing the list fails.
      onDirty(false);
      setSuccess(publish ? "live" : "saved");
      await onSaved(id).catch(() => {});
      requestAnimationFrame(() => feedback.current?.focus());
    } catch (cause) {
      if (isCurrent()) {
        const code = (cause as { code?: string }).code;
        fail(code === "40001" ? copy.conflict : copy.saveError);
      }
    } finally {
      lock.current = false;
      if (isCurrent()) setBusy(null);
    }
  }
  const currentCategory = categories.find(
    (c) => `${c.program.toLowerCase()}/${c.slug}` === course,
  );
  return (
    <form
      className="admin-editor"
      onSubmit={submit}
      onChange={() => {
        onDirty(true);
        setSuccess(null);
      }}
      aria-busy={!!busy}
    >
      <h2 id="admin-form-title" tabIndex={-1}>
        {lesson ? copy.edit : copy.newTitle}
      </h2>
      <fieldset disabled={!!busy}>
        <label className="admin-field">
          <span>{copy.course}</span>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            disabled={!!lesson}
            aria-describedby={lesson ? "admin-course-hint" : undefined}
          >
            {categories.map((c) => (
              <option
                key={`${c.program}/${c.slug}`}
                value={`${c.program.toLowerCase()}/${c.slug}`}
              >
                {c.program} / {localizeCategory(c, locale).title}
              </option>
            ))}
          </select>
        </label>
        {lesson && (
          <p className="admin-hint" id="admin-course-hint">
            {copy.lockedCourse}
          </p>
        )}
        <label className="admin-field">
          <span>{copy.name}</span>
          <input
            required
            maxLength={240}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>{copy.summary}</span>
          <textarea
            required
            maxLength={600}
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>{copy.description}</span>
          <textarea
            required
            maxLength={12000}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby="admin-content-hint"
          />
        </label>
        <p className="admin-hint" id="admin-content-hint">
          {copy.contentHint}
        </p>
        <div className="admin-materials">
          <h3>{copy.video}</h3>
          <label className="admin-field">
            <span className="sr-only">{copy.video}</span>
            <textarea
              rows={2}
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              disabled={lesson?.ever_published}
              aria-describedby="admin-video-hint"
            />
          </label>
          <p className="admin-hint" id="admin-video-hint">
            {lesson?.ever_published ? copy.immutable : copy.videoHint}
          </p>
          <div className="admin-pair">
            <label className="admin-field">
              <span>{copy.duration}</span>
              <input
                inputMode="text"
                placeholder="1:54"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={lesson?.ever_published}
                aria-describedby="admin-duration-hint"
              />
            </label>
            <label className="admin-field">
              <span>{copy.order}</span>
              <input
                type="number"
                min="0"
                max="10000"
                required
                step="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                aria-describedby="admin-order-hint"
              />
            </label>
          </div>
          <p className="admin-hint" id="admin-duration-hint">
            {copy.durationHint}
          </p>
          <p className="admin-hint" id="admin-order-hint">
            {copy.orderHint}
          </p>
          <label className="admin-field admin-file">
            <span>{copy.pdf}</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                uploaded.current = null;
              }}
              aria-describedby="admin-pdf-hint"
            />
          </label>
          <p className="admin-hint" id="admin-pdf-hint">
            {copy.pdfHint}
          </p>
          {(path || file) && (
            <p className="admin-file-status">
              {copy.pdfAttached}
              {file ? `: ${file.name}` : ""}
            </p>
          )}
        </div>
      </fieldset>
      <div
        ref={feedback}
        tabIndex={-1}
        className={
          error
            ? "auth-feedback auth-feedback--error"
            : success
              ? "auth-feedback"
              : "admin-feedback"
        }
        role={error ? "alert" : "status"}
      >
        {error ?? (success ? copy[success] : "")}
        {success === "live" && currentCategory && (
          <a
            className="text-action"
            href={educationPath(
              currentCategory.program,
              currentCategory.slug,
              id,
            )}
          >
            {copy.open}
          </a>
        )}
      </div>
      <div className="admin-actions">
        <button
          className="secondary-button"
          disabled={!!busy}
          type="submit"
          value="draft"
        >
          {lesson?.is_published ? copy.hide : copy.saveDraft}
        </button>
        <button
          className="primary-button"
          disabled={!!busy}
          type="submit"
          value="publish"
        >
          {busy
            ? copy[busy]
            : lesson?.is_published
              ? copy.update
              : copy.publish}
        </button>
      </div>
    </form>
  );
}
