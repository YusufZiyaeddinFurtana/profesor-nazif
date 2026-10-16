import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useLocale } from "../../i18n/LocaleProvider";
import { useCatalog } from "../catalog/CatalogProvider";
import { useLearning } from "../learning/LearningProvider";
import { adminLessons } from "./adminService";
import { adminMessages } from "./messages";
import { LessonForm } from "./LessonForm";
import type { AdminLesson } from "./types";
export function AdminWorkspace({ userId }: { userId: string }) {
  const { locale } = useLocale();
  const copy = adminMessages[locale];
  const { session } = useAuth();
  const catalog = useCatalog(),
    learning = useLearning();
  const [rows, setRows] = useState<AdminLesson[]>([]),
    [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0),
    [selected, setSelected] = useState<AdminLesson | null>(null),
    [formKey, setFormKey] = useState(0),
    [query, setQuery] = useState("");
  const dirty = useRef(false),
    active = useRef(true),
    currentUser = useRef(session?.user.id);
  currentUser.current = session?.user.id;
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    adminLessons(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setRows(items);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    const confirm = (event: BeforeUnloadEvent) => {
      if (dirty.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (dirty.current && target && !window.confirm(copy.leave)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", confirm);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", confirm);
      document.removeEventListener("click", click, true);
    };
  }, [copy.leave]);
  function select(row: AdminLesson | null) {
    if (dirty.current && !window.confirm(copy.leave)) return;
    dirty.current = false;
    setSelected(row);
    setFormKey((n) => n + 1);
    requestAnimationFrame(() =>
      document.getElementById("admin-form-title")?.focus(),
    );
  }
  const matches = rows.filter((row) =>
    `${row.title} ${row.course_id}`
      .toLocaleLowerCase(locale)
      .includes(query.toLocaleLowerCase(locale)),
  );
  return (
    <div className="admin-workspace">
      <aside className="admin-library" aria-label={copy.listTitle}>
        <div className="admin-library-heading">
          <h2>{copy.listTitle}</h2>
          <button
            className="text-action"
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            disabled={status === "loading"}
          >
            {copy.reload}
          </button>
        </div>
        <button
          className="primary-button admin-new"
          type="button"
          onClick={() => select(null)}
        >
          {copy.newLesson}
        </button>
        <label className="admin-field">
          <span>{copy.search}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {status === "loading" ? (
          <p role="status">{copy.loading}</p>
        ) : status === "error" ? (
          <div role="alert">
            <p>{copy.error}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setAttempt((n) => n + 1)}
            >
              {copy.retry}
            </button>
          </div>
        ) : (
          <ul className="admin-lesson-list">
            {matches.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  aria-pressed={selected?.id === row.id}
                  onClick={() => select(row)}
                >
                  <span>
                    {row.program} ·{" "}
                    {row.is_published ? copy.published : copy.draft}
                  </span>
                  <strong>{row.title}</strong>
                </button>
              </li>
            ))}
          </ul>
        )}
        {status === "ready" && !matches.length && (
          <p>{rows.length ? copy.noMatch : copy.empty}</p>
        )}
      </aside>
      <LessonForm
        key={formKey}
        lesson={selected}
        userId={userId}
        isCurrent={() => active.current && currentUser.current === userId}
        onDirty={(value) => {
          dirty.current = value;
        }}
        onSaved={async (id) => {
          dirty.current = false;
          catalog.retry();
          learning.retry();
          // A saved form is refreshed immediately to obtain its new concurrency token.
          const items = await adminLessons(new AbortController().signal);
          if (!active.current || currentUser.current !== userId) return;
          setRows(items);
          setSelected(items.find((row) => row.id === id) ?? null);
        }}
      />
    </div>
  );
}
