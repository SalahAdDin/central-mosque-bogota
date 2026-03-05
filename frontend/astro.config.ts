import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es", "ar", "tr"],
    fallback: {
      en: "es",
      tr: "en",
      ar: "en",
    },
    routing: {
      prefixDefaultLocale: true,
      fallbackType: "rewrite",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
