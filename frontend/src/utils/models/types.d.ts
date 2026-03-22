import type {
  COLORS,
  ICON_POSITIONS,
  DAILY_PRAYERS,
  SVG_ICONS,
  SIZES,
  VARIANTS,
  DROPDOWN_POSITIONS,
  DROPDOWN_ALIGNS,
} from "../ui.constants";

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
 * Valid daily prayer keys used throughout the app.
 *
 * This type is derived from `DAILY_PRAYERS` to ensure UI ordering and allowed values
 * stay in sync with the design system constants.
 */
export type TDailyPrayer = (typeof DAILY_PRAYERS)[number];

/**
 * Shape of the daily schedule object expected by prayer-time UI components.
 *
 * Values are `HH:mm` strings.
 *
 * Notes:
 * - Includes `sunrise` as an extra time used for display and for the post-sunrise
 *   prohibited-time window logic.
 */
export type TDailyPrayerSchedule = Record<TDailyPrayer | "sunrise", string>;

/**
 * Type representing a valid position for a dropdown menu.
 */
export type TDropdownPosition = (typeof DROPDOWN_POSITIONS)[number];

/**
 * Type representing a valid align for a dropdown menu.
 */
export type TDropdownAlign = (typeof DROPDOWN_ALIGNS)[number];

export type TContactInfo = {
  /**
   * Full physical address of the organization.
   */
  address: string;
  /**
   * Primary contact phone number.
   */
  phone: string;
  /**
   * Official email address for communication.
   */
  email: string;
};

export type TRightsTexts = {
  /**
   * Copyright notice for the organization.
   */
  copyRight: string;
  /**
   * Link to the organization's privacy policy.
   */
  privacyPolicy: TNavLink;
  /**
   * Link to the organization's terms and conditions.
   */
  termsAndConditions: TNavLink;
};
