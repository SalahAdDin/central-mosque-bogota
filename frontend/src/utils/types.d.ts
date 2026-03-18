import type {
  COLORS,
  ICON_POSITIONS,
  SVG_ICONS,
  SIZES,
  VARIANTS,
  DROPDOWN_POSITIONS,
  DROPDOWN_ALIGNS,
} from "./ui.constants";

/**
 * Type representing a valid color from the design system palette.
 */
export type TColor = (typeof COLORS)[number];

/**
 * Type representing the position of an icon.
 */
export type TIconPosition = (typeof ICON_POSITIONS)[number];

/**
 * Type representing available custom SVG icons.
 */
export type TSVGIcon = (typeof SVG_ICONS)[number];

/**
 * Type representing a valid size from the design system scale.
 */
export type TSize = (typeof SIZES)[number];

/**
 * Type representing a visual style variant.
 */
export type TVariant = (typeof VARIANTS)[number];

export type TNavLink = {
  label: string;
  href: string;
};

/**
 * Type representing a valid position for a dropdown menu.
 */
export type TDropdownPosition = (typeof DROPDOWN_POSITIONS)[number];

/**
 * Type representing a valid align for a dropdown menu.
 */
export type TDropdownAlign = (typeof DROPDOWN_ALIGNS)[number];
