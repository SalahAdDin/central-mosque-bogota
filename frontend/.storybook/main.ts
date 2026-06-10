import { defineMain } from "@storybook-astro/framework/node";
// import path from "node:path";

/*
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(new URL(import.meta.url).pathname);
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
  /*
  TODO: it seems path aliases are supported by default
  viteFinal: async (config) => {
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
