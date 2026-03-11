// import type { Renderer } from "@storybook-astro/renderer";
import { definePreview } from "@storybook-astro/framework";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { withThemeByClassName } from "@storybook/addon-themes";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { CUSTOM_VIEW_PORTS } from "./constants";

import "@/styles/global.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default definePreview({
  addons: [addonA11y(), addonDocs()],
  decorators: [
    // withThemeByClassName<Renderer>({
    withThemeByClassName({
      // TODO: check this
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    viewport: {
      options: { ...CUSTOM_VIEW_PORTS, ...INITIAL_VIEWPORTS },
    },
  },
  tags: ["autodocs"],
});
