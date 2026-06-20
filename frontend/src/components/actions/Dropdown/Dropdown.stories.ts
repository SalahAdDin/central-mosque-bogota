import preview from "@storybook/preview";

import StoriesMock from "./StoriesMock.astro";

const VARIANTS = [
  "basic",
  "navigation",
  "hover",
  "submenu",
  "shortcuts",
  "placement",
  "icons",
  "checkbox",
] as const;

const meta = preview.meta({
  title: "Components/Actions/Dropdown",
  component: StoriesMock,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    variant: "basic",
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
});

export const Basic = meta.story({
  args: { variant: "basic" },
});

export const Navigation = meta.story({
  args: { variant: "navigation" },
});

export const HoverOpen = meta.story({
  args: { variant: "hover" },
});

export const Submenu = meta.story({
  args: { variant: "submenu" },
});

export const Shortcuts = meta.story({
  args: { variant: "shortcuts" },
});

export const Placement = meta.story({
  args: { variant: "placement" },
});

export const WithIcons = meta.story({
  args: { variant: "icons" },
});

export const CheckboxItems = meta.story({
  args: { variant: "checkbox" },
});
