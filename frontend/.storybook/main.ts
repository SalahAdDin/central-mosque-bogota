// eslint-disable-next-line import-x/no-unresolved
import { defineMain } from "@storybook-astro/framework/node";
// import type { ViteUserConfig } from "astro";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

/*
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
*/

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
    "@storybook/addon-docs",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "storybook-addon-rtl",
  ],
  framework: {
    name: "@storybook-astro/framework",
    options: { integrations: [] },
  },
  /* TODO: it seems path aliases are supported by default
  viteFinal: async (config: ViteUserConfig) => {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      resolve: {
        alias: {
          "@components": path.resolve(dirname, "../src/components"),
          "@layouts": path.resolve(dirname, "../src/layouts"),
          "@pages": path.resolve(dirname, "../src/pages"),
          "@styles": path.resolve(dirname, "../src/styles"),
          "@utils": path.resolve(dirname, "../src/utils"),
          "@": path.resolve(dirname, "../src"),
        },
      },
    });
  }, */
});
