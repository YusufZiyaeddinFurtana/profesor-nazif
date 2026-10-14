import type { Locale } from "../../i18n/types";
import type { Program } from "../catalog/types";
export type Instructor = {
  id: string;
  name: string;
  photo?: string;
  university?: string;
  firstExperience?: string;
  programs?: Program[];
  bio?: Partial<Record<Locale, string>>;
};
