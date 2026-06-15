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
});
