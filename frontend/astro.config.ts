import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-display",
      weights: [400, 500, 600, 700, 800],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Public Sans",
      cssVariable: "--font-sans",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Material Symbols Outlined",
      cssVariable: "--font-symbols",
    },
  ],
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
