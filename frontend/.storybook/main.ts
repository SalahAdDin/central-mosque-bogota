// import type { ViteUserConfig } from "astro";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
import { defineMain } from "@storybook-astro/framework/node";

/*
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
*/

export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "storybook-addon-rtl",
    "storybook-addon-tag-badges",
  ],
  framework: {
    name: "@storybook-astro/framework",
  },
  /* TODO: it seems path aliases are supported by default
  viteFinal: async (config: ViteUserConfig) => {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      resolve: {
        alias: {
          "@components": path.resolve(dirname, "../src/components"),
          "@i18n": path.resolve(dirname, "../src/i18n"),
          "@layouts": path.resolve(dirname, "../src/layouts"),
          "@pages": path.resolve(dirname, "../src/pages"),
          "@styles": path.resolve(dirname, "../src/styles"),
          "@utils": path.resolve(dirname, "../src/utils"),
          "@": path.resolve(dirname, "../src"),
        },
      },
    });
  },
  */
});
