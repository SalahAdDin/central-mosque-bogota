import preview from "@storybook/preview";
import { SIZES, VARIANTS } from "@utils/ui.constants.ts";

import Button from "./Button.astro";

const BUTTON_COLORS = [
  "neutral",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
] as const;

const meta = preview.meta({
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    slots: {
      default: "Button",
    },
    variant: "solid",
    size: "md",
    color: "primary",
    disabled: false,
    fullWidth: false,
    ariaLabel: undefined,
    as: "button",
    href: undefined,
    type: "button",
  },
  argTypes: {
    /*
    TODO: It does not work, does not render documentation for slots.
    slots: {
      default: {
        control: "text",
        name: "label",
        description: "Visible label rendered in the default slot",
      },
    },
    */
    variant: {
      control: "select",
      options: VARIANTS,
    },
    size: {
      control: "select",
      options: SIZES,
    },
    color: {
      control: "select",
      options: BUTTON_COLORS,
    },
    disabled: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    ariaLabel: {
      control: "text",
      name: "aria-label",
    },
    as: {
      control: "select",
      options: ["button", "a"],
    },
    href: {
      control: "text",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    class: {
      control: "text",
    },
    iconSize: {
      control: false,
      table: { disable: true },
    },
  },
});

export const Primary = meta.story({
  args: {
    slots: { default: "Primary button" },
    variant: "solid",
    color: "primary",
  },
});

export const Secondary = meta.story({
  args: {
    slots: { default: "Secondary button" },
    variant: "solid",
    color: "secondary",
  },
});

export const Soft = meta.story({
  args: {
    slots: { default: "Soft button" },
    variant: "soft",
    color: "info",
  },
});

export const Outline = meta.story({
  args: {
    slots: { default: "Outline button" },
    variant: "outline",
    color: "neutral",
  },
});

export const LinkButton = meta.story({
  args: {
    as: "a",
    href: "https://example.com",
    slots: { default: "Anchor button" },
    type: undefined,
  },
});

export const Disabled = meta.story({
  args: {
    slots: { default: "Disabled button" },
    disabled: true,
  },
});

export const FullWidth = meta.story({
  args: {
    slots: { default: "Full width button" },
    fullWidth: true,
  },
});
