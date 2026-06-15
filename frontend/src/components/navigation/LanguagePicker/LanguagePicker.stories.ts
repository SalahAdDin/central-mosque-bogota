import preview from "@storybook/preview";

import LanguagePicker from "./LanguagePicker.astro";

const meta = preview.meta({
  title: "Components/Navigation/LanguagePicker",
  component: LanguagePicker as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    side: "bottom",
    align: "end",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
  },
});

export const Default = meta.story({});

export const AlignStart = meta.story({
  args: {
    align: "start",
  },
});
