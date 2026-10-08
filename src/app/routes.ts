import type { Program } from "../features/catalog/types";

type Route =
  | { kind: "home" }
  | {
      kind: "education";
      program: Program;
      categorySlug?: string;
      lessonId?: string;
    }
  | { kind: "legacy-lesson"; lessonId: string }
  | { kind: "not-found" };

export function educationPath(
  program: Program,
  categorySlug?: string,
  lessonId?: string,
) {
  const parts = ["egitimler", program.toLowerCase(), categorySlug, lessonId];
  return (
    "/" +
    parts
      .filter((part): part is string => part !== undefined)
      .map(encodeURIComponent)
      .join("/")
  );
}

/** Decode individual segments so malformed paths never crash the application. */
export function resolveRoute(pathname: string): Route {
  if (pathname === "/") return { kind: "home" };
  let parts: string[];
  try {
    parts = pathname
      .replace(/\/$/, "")
      .split("/")
      .slice(1)
      .map(decodeURIComponent);
  } catch {
    return { kind: "not-found" };
  }
  if (parts.some((part) => !part || part.includes("/")))
    return { kind: "not-found" };
  if (parts.length === 2 && parts[0] === "ders")
    return { kind: "legacy-lesson", lessonId: parts[1] };
  if (parts[0] !== "egitimler" || parts.length < 2 || parts.length > 4)
    return { kind: "not-found" };
  const program =
    parts[1] === "frc" ? "FRC" : parts[1] === "fll" ? "FLL" : undefined;
  if (!program) return { kind: "not-found" };
  return {
    kind: "education",
    program,
    categorySlug: parts[2],
    lessonId: parts[3],
  };
}
