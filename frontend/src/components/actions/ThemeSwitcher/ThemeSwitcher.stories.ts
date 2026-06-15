import preview from "@storybook/preview";

import ThemeSwitcher from "./ThemeSwitcher.astro";

const meta = preview.meta({
  title: "Components/Actions/ThemeSwitcher",
  component: ThemeSwitcher as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    class: {
      control: "text",
    },
  },
  parameters: {
    backgrounds: {
      options: {
        navy: { name: "Navy", value: "#212e80" },
      },
    },
  },
  globals: {
    backgrounds: { value: "navy" },
  },
});

export const Default = meta.story({});

export const Small = meta.story({
  args: {
    size: "sm",
  },
});

export const Large = meta.story({
  args: {
    size: "lg",
  },
});
