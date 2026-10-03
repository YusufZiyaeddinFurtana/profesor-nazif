import { useNavigation } from "../../app/Navigation";
import type { Program } from "./types";

export function useCatalogFilters() {
  const { location, navigate } = useNavigation();
  const params = new URLSearchParams(location.search);
  const value = params.get("program");
  const program: "Tümü" | Program =
    value === "FRC" || value === "FLL" ? value : "Tümü";
  const group = params.get("group") || "Tümü";
  const topic = params.get("topic") || "Tümü";
  const query = params.get("q") || "";
  function update(values: Record<string, string | null>) {
    const next = new URLSearchParams(location.search);
    Object.entries(values).forEach(([key, value]) => {
      if (!value || value === "Tümü") next.delete(key);
      else next.set(key, value);
    });
    navigate(`/${next.size ? "?" + next : ""}${location.hash}`, true);
  }
  return {
    program,
    group,
    topic,
    query,
    setProgram: (program: "Tümü" | Program) =>
      update({ program, group: null, topic: null }),
    setQuery: (q: string) => update({ q }),
    resetFilters: () =>
      update({ program: null, group: null, topic: null, q: null }),
  };
}
