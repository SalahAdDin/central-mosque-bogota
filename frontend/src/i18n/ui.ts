import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { tr } from "./locales/tr";

export const languages = {
  ar: "العربية",
  en: "English",
  es: "Español",
  tr: "Türkçe",
};

export const localeFlags = [
  { code: "ar", flag: "🇸🇦" },
  { code: "es", flag: "🇪🇸" },
  { code: "en", flag: "🇺🇸" },
  { code: "tr", flag: "🇹🇷" },
] as const;

export const defaultLang = "es";

export const ui = {
  ar,
  en,
  es,
  tr,
} as const;
