import preview from "@storybook/preview";

import Welcome from "./Welcome.astro";

const meta = preview.meta({
  title: "Components/Welcome",
  component: Welcome,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
});

export const Default = meta.story({});
