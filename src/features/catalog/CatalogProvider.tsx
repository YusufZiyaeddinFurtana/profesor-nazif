import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadLessons } from "./catalogService";
import type { Lesson } from "./types";

export type CatalogState = "loading" | "ready" | "error";
const CatalogContext = createContext<{
  lessons: Lesson[];
  status: CatalogState;
  retry: () => void;
} | null>(null);
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [status, setStatus] = useState<CatalogState>("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    loadLessons(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setLessons(items);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <CatalogContext
      value={{ lessons, status, retry: () => setAttempt((value) => value + 1) }}
    >
      {children}
    </CatalogContext>
  );
}
export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("CatalogProvider eksik.");
  return context;
}
