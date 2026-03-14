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
export const SVG_ICONS = ["facebook", "instagram", "youtube"] as const;

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
