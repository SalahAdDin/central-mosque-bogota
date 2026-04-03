import preview from "@storybook/preview";

import Mock from "./Mock.astro";

const meta = preview.meta({
  title: "Components/Layout/Table",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Mock,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
});

export const Default = meta.story({});
