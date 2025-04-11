import { defineRouting } from "next-intl/routing";

export const languages = [
  "ar",
  "de",
  "en",
  "es",
  "fr",
  "he",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "zh",
] as const;

export type Language = (typeof languages)[number];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: languages,

  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: "as-needed",
});
