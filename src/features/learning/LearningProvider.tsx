import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthProvider";
import {
  completeExercise,
  loadCompletions,
  loadLearning,
  recordWatch,
} from "./learningService";
import type {
  CourseCompletion,
  CourseMembership,
  LessonMaterial,
  LessonProgress,
} from "./types";
type Data = {
  materials: LessonMaterial[];
  memberships: CourseMembership[];
  progress: LessonProgress[];
  completions: CourseCompletion[];
};
type Status = "idle" | "loading" | "ready" | "error";
const empty: Data = {
  materials: [],
  memberships: [],
  progress: [],
  completions: [],
};
const Context = createContext<
  | (Data & {
      status: Status;
      retry: () => void;
      saveWatch: (id: string, from: number, to: number) => Promise<void>;
      markExercise: (id: string) => Promise<void>;
    })
  | null
>(null);
export function LearningProvider({ children }: { children: ReactNode }) {
  const { session, status: authStatus } = useAuth();
  const userId = authStatus === "ready" ? session?.user.id : undefined;
  const currentUser = useRef(userId);
  currentUser.current = userId;
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<
    Data & { userId?: string; status: Status }
  >({ ...empty, status: "idle" });
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setResource({ ...empty, userId, status: "loading" });
    loadLearning(userId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setResource({ ...data, userId, status: "ready" });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResource({ ...empty, userId, status: "error" });
      });
    return () => controller.abort();
  }, [userId, attempt]);
  async function update(action: () => Promise<LessonProgress>) {
    if (!userId || currentUser.current !== userId)
      throw new Error("Sign in required");
    const progress = await action();
    if (currentUser.current !== userId) return;
    setResource((old) => {
      const previous = old.progress.find(
        (p) => p.lesson_id === progress.lesson_id,
      );
      return {
        ...old,
        progress: [
          ...old.progress.filter((p) => p.lesson_id !== progress.lesson_id),
          {
            ...progress,
            watched_seconds: Math.max(
              previous?.watched_seconds ?? 0,
              progress.watched_seconds,
            ),
            video_completed_at:
              progress.video_completed_at ??
              previous?.video_completed_at ??
              null,
            exercise_completed_at:
              progress.exercise_completed_at ??
              previous?.exercise_completed_at ??
              null,
          },
        ],
      };
    });
    if (progress.video_completed_at && progress.exercise_completed_at) {
      const completions = await loadCompletions(userId);
      if (currentUser.current === userId)
        setResource((old) => ({ ...old, completions }));
    }
  }
  const belongs = !!userId && resource.userId === userId;
  return (
    <Context.Provider
      value={{
        ...(belongs ? resource : empty),
        status: !userId ? "idle" : belongs ? resource.status : "loading",
        retry: () => setAttempt((v) => v + 1),
        saveWatch: (id, from, to) => update(() => recordWatch(id, from, to)),
        markExercise: (id) => update(() => completeExercise(id)),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLearning() {
  const context = useContext(Context);
  if (!context) throw new Error("LearningProvider missing");
  return context;
}
