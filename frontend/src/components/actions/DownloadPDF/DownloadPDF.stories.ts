import preview from "@storybook/preview";

import Mock from "./Mock.astro";

const meta = preview.meta({
  title: "Components/Actions/DownloadPDF",
  component: Mock as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
});

export const Default = meta.story({});
