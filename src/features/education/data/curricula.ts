import type { Locale } from "../../../i18n/types";
export type Curriculum = {
  outcomes: string[];
  application: string;
  reviewed: boolean;
};
/** Stable key: FRC/programming. Add approved curricula and mark reviewed:true after content review. */
export const curricula: Record<
  string,
  Partial<Record<Locale, Curriculum>>
> = {};
