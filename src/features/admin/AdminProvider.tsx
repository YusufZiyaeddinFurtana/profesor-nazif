import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthProvider";
import { checkAdmin } from "./adminService";
type Status = "idle" | "loading" | "ready" | "error";
const Context = createContext<{
  isAdmin: boolean;
  status: Status;
  retry: () => void;
} | null>(null);
export function AdminProvider({ children }: { children: ReactNode }) {
  const { session, status: authStatus } = useAuth();
  const userId = authStatus === "ready" ? session?.user.id : undefined;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    userId?: string;
    isAdmin: boolean;
    status: Status;
  }>({ isAdmin: false, status: "idle" });
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setResult((old) =>
      old.userId === userId && old.status === "ready"
        ? old
        : { userId, isAdmin: false, status: "loading" },
    );
    checkAdmin(controller.signal)
      .then((isAdmin) => {
        if (!controller.signal.aborted)
          setResult({ userId, isAdmin, status: "ready" });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ userId, isAdmin: false, status: "error" });
      });
    return () => controller.abort();
  }, [userId, session?.access_token, attempt]);
  useEffect(() => {
    const refresh = () => setAttempt((n) => n + 1);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  const belongs = !!userId && result.userId === userId;
  return (
    <Context.Provider
      value={{
        isAdmin: belongs && result.status === "ready" && result.isAdmin,
        status: !userId ? "idle" : belongs ? result.status : "loading",
        retry: () => setAttempt((n) => n + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAdmin() {
  const value = useContext(Context);
  if (!value) throw new Error("AdminProvider missing");
  return value;
}
