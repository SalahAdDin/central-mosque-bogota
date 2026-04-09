import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      ISLAMIC_API_URL: envField.string({ context: "client", access: "public" }),
      ISLAMIC_API_KEY: envField.string({ context: "server", access: "secret" }),
      LOCATION_API_URL: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
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
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
