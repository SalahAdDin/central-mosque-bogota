/**
 * Standard color palette used across UI components.
 * These correspond to the semantic colors defined in the global CSS variables.
 */
export const COLORS = [
  "navbar",
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
 * - solid: Solid background with contrasting text
 * - soft: Low-opacity background with colored text
 * - outline: Transparent background with colored border and text
 */
export const VARIANTS = ["solid", "soft", "outline"] as const;

/**
 * Canonical ordering of daily prayer-related time keys used in the UI.
 *
 * Notes:
 * - Includes the five fard prayers plus `sunrise` (informational only).
 * - Intended for display and type safety, not for calculating prayer times.
 */

export const DAILY_PRAYERS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;

/**
 * Valid positions for a dropdown menu relative to its trigger element.
 */
export const DROPDOWN_POSITIONS = ["top", "bottom", "left", "right"] as const;

/**
 * Valid alignments for a dropdown menu relative to its trigger element.
 */
export const DROPDOWN_ALIGNS = ["start", "center", "end"] as const;
