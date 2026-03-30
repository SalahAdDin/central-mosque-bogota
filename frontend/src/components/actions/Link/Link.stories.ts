// import { COLORS, SIZES } from "@utils/ui.constants.ts";

import preview from "@storybook/preview";

import Link from "./Link.astro";

const meta = preview.meta({
  title: "Components/Actions/Link",
  component: Link,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    href: "/",
    // In Astro stories, the default slot is passed via this "default" arg
    default: "Link text",
    size: "md",
    color: "primary",
    ariaLabel: undefined,
    disabled: false,
    target: undefined,
    rel: undefined,
  },
  /*   argTypes: {
    href: {
      control: "text",
    },
    default: {
      control: "text",
      name: "label",
      description: "Visible label rendered in the default slot",
    },
    ariaLabel: {
      control: "text",
      name: "aria-label",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Typography size of the link text",
    },
    color: {
      control: "select",
      options: COLORS,
      description: "Semantic color variant",
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
  }, */
});

export const Primary = meta.story({
  args: {
    color: "primary",
    href: "/",
    default: "Primary link",
  },
});

export const Secondary = meta.story({
  args: {
    color: "secondary",
    href: "/",
    default: "Secondary link",
  },
});

export const Neutral = meta.story({
  args: {
    color: "neutral",
    href: "/",
    default: "Neutral link",
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    href: "/disabled",
    default: "Disabled link",
  },
});

export const External = meta.story({
  args: {
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    default: "External link",
  },
});

export const Sizes = meta.story({
  args: {
    href: "/",
    default: "Medium link",
    size: "md",
  },
});
