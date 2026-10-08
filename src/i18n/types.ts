import type { messages } from "./locales/tr";
export const locales = ["tr", "en", "zh-Hans", "hil"] as const;
export type Locale = (typeof locales)[number];
export type MessageKey = keyof typeof messages;
export type Messages = Record<MessageKey, string>;
export type LessonTranslation = {
  title: string;
  summary: string;
  longDescription: string;
};
