import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthProvider";
import { loadPreferences, savePreferences } from "./preferencesService";
import { emptyPreferences, type LearningPreferences } from "./types";

type Status = "idle" | "loading" | "ready" | "error";
const PreferencesContext = createContext<{
  preferences: LearningPreferences;
  status: Status;
  retry: () => void;
  save: (value: LearningPreferences) => Promise<void>;
} | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { session, status: authStatus } = useAuth();
  const userId = authStatus === "ready" ? session?.user.id : undefined;
  const currentUser = useRef(userId);
  currentUser.current = userId;
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<{
    userId?: string;
    status: Status;
    preferences: LearningPreferences;
  }>({ status: "idle", preferences: emptyPreferences });
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setResource({ userId, status: "loading", preferences: emptyPreferences });
    loadPreferences(userId, controller.signal)
      .then((preferences) => {
        if (!controller.signal.aborted)
          setResource({ userId, status: "ready", preferences });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResource({
            userId,
            status: "error",
            preferences: emptyPreferences,
          });
      });
    return () => controller.abort();
  }, [userId, attempt]);
  async function save(value: LearningPreferences) {
    if (!userId) throw new Error("Sign in required.");
    const preferences = await savePreferences(userId, value);
    if (currentUser.current === userId)
      setResource({ userId, status: "ready", preferences });
  }
  const belongsToUser = !!userId && resource.userId === userId;
  return (
    <PreferencesContext.Provider
      value={{
        preferences: belongsToUser ? resource.preferences : emptyPreferences,
        status: !userId ? "idle" : belongsToUser ? resource.status : "loading",
        retry: () => setAttempt((value) => value + 1),
        save,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("PreferencesProvider missing");
  return context;
}
