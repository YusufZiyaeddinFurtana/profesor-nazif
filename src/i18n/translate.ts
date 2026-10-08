import { messages as tr } from "./locales/tr.ts";
import { messages as en } from "./locales/en.ts";
import { messages as zh } from "./locales/zh-Hans.ts";
import { messages as hil } from "./locales/hil.ts";
import type { Locale, MessageKey, Messages } from "./types.ts";
export const dictionaries: Record<Locale, Messages> = {
  tr,
  en,
  "zh-Hans": zh,
  hil,
};
export const languageStorageKey = "nazif-language-v1";
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(dictionaries, value);
}
export function translate(
  locale: Locale,
  key: MessageKey,
  params: Record<string, string | number> = {},
) {
  return dictionaries[locale][key].replace(
    /\{(\w+)\}/g,
    (token, name: string) =>
      params[name] === undefined ? token : String(params[name]),
  );
}
