import preview from "@storybook/preview";

import SvgIcon from "./SvgIcon.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Icons/SvgIcon",
  component: SvgIcon as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    name: "facebook",
    class: "w-10 h-10",
  },
});

export const Facebook = meta.story({
  args: { name: "facebook" },
});
export const Instagram = meta.story({
  args: { name: "instagram" },
});
export const YouTube = meta.story({
  args: { name: "youtube" },
});
