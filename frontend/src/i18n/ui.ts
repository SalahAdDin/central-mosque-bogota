import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { tr } from "./locales/tr";

/**
 * Human-readable display names for each supported locale.
 *
 * Keys are locale codes used throughout the app (e.g. in URL prefixes).
 */
export const languages = {
  ar: "العربية",
  en: "English",
  es: "Español",
  tr: "Türkçe",
};

/**
 * Locale metadata used by the language picker UI.
 *
 * `code` must match a supported locale key and is used to build locale-prefixed URLs.
 */
export const localeFlags = [
  { code: "ar", flag: "🇸🇦" },
  { code: "es", flag: "🇪🇸" },
  { code: "en", flag: "🇺🇸" },
  { code: "tr", flag: "🇹🇷" },
] as const;

/**
 * Default locale used when the URL does not include a supported locale prefix.
 */
export const defaultLang = "es";

/**
 * Per-locale translation dictionaries.
 *
 * Each locale module should export a dictionary object used by `useTranslations`.
 */
export const ui = {
  ar,
  en,
  es,
  tr,
} as const;

/**
 * Supported locale union type derived from the `ui` dictionary keys.
 */
export type TLang = keyof typeof ui;

/**
 * Route localization map used to translate between canonical route keys and localized slugs.
 *
 * - The inner record key is the canonical route key (e.g. `"prayer-information"`).
 * - The inner record value is the localized slug for that locale (e.g. `"informacion-oraciones"`).
 *
 * This is used by helpers like `useTranslatedPath` and components like `LanguagePicker`
 * to switch languages while keeping users on the equivalent route.
 */
export const routes: Record<TLang, Record<string, string | undefined>> = {
  es: {
    "prayer-information": "informacion-oraciones",
  },
  en: {
    "prayer-information": "prayer-information",
  },
  ar: {
    "prayer-information": "prayer-information",
  },
  tr: {
    "prayer-information": "namaz-belgesi",
  },
};

/**
 * Whether the default locale should be shown as a URL prefix.
 *
 * When `false`, the canonical (unprefixed) URL is treated as default locale content.
 */
export const showDefaultLang = false;
