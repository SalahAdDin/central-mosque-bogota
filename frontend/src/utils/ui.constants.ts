/**
 * Standard color palette used across UI components.
 * These correspond to the semantic colors defined in the global CSS variables.
 */
export const COLORS = [
  "neutral",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
] as const;

/**
 * Valid positions for icons relative to text content within components like Buttons.
 */
export const ICON_POSITIONS = ["leading", "trailing"] as const;

/**
 * List of supported social media and brand icons that are rendered as custom SVGs.
 * @see SvgIcon.astro
 */
export const OTHER_ICONS = ["facebook", "instagram", "youtube"] as const;

/**
 * Standard t-shirt sizing scale for UI components.
 */
export const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Visual style variants available for components like Buttons and Badges.
 * - normal: Solid background with contrasting text
 * - soft: Low-opacity background with colored text
 * - outline: Transparent background with colored border and text
 */
export const VARIANTS = ["normal", "soft", "outline"] as const;

/**
 * Type representing a valid color from the design system palette.
 */
export type Color = (typeof COLORS)[number];

/**
 * Type representing the position of an icon.
 */
export type IconPosition = (typeof ICON_POSITIONS)[number];

/**
 * Type representing available custom SVG icons.
 */
export type OtherIcon = (typeof OTHER_ICONS)[number];

/**
 * Type representing a valid size from the design system scale.
 */
export type Size = (typeof SIZES)[number];

/**
 * Type representing a visual style variant.
 */
export type Variant = (typeof VARIANTS)[number];
