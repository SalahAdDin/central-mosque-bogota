import preview from "@storybook/preview";
import { COLORS, SIZES } from "@utils/ui.constants.ts";

import Link from "./Link.astro";

const meta = preview.meta({
  title: "Components/Actions/Link",
  component: Link,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    slots: {
      default: "Link",
    },
    href: "/",
    // In Astro stories, the default slot is passed via this "default" arg
    size: "md",
    color: "primary",
    ariaLabel: undefined,
    disabled: false,
    target: undefined,
    rel: undefined,
  },
  argTypes: {
    /* slots: {
      control: "object",
      name: "label",
      description: "Visible label rendered in the default slot",
    }, */
    href: {
      control: "text",
    },
    ariaLabel: {
      control: "text",
      name: "aria-label",
    },
    size: {
      control: "select",
      options: SIZES,
      // description: "Typography size of the link text",
    },
    color: {
      control: "select",
      options: COLORS,
      // description: "Semantic color variant",
    },
    disabled: {
      control: "boolean",
    },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
    },
    rel: {
      control: "text",
    },
    class: {
      control: "text",
    },
    // Hide internal cva wiring from the controls table if it ever appears
    disabledStyle: {
      control: false,
      table: { disable: true },
    },
  },
});

export const Primary = meta.story({
  args: {
    color: "primary",
    href: "/",
    slots: { default: "Primary link" },
  },
});

export const Secondary = meta.story({
  args: {
    color: "secondary",
    href: "/",
    slots: { default: "Secondary link" },
  },
});

export const Neutral = meta.story({
  args: {
    color: "neutral",
    href: "/",
    slots: { default: "Neutral link" },
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    href: "/disabled",
    slots: { default: "Disabled link" },
  },
});

export const External = meta.story({
  args: {
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    slots: { default: "External link" },
  },
});

export const Sizes = meta.story({
  args: {
    href: "/",
    slots: { default: "Medium link" },
    size: "md",
  },
});
