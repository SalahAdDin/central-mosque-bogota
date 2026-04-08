/**
 * Parses a `HH:mm` string into the number of minutes since midnight.
 * Returns `null` for invalid, missing, or out-of-range values.
 */
export const parseTimeToMinutes = (value: string | null | undefined): number | null => {
  if (typeof value !== "string") return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

/**
 * Gets the current minutes since midnight for the given IANA timezone.
 * Falls back to local time if the timezone is invalid or unsupported.
 */
export const getCurrentMinutes = (timeZone: string): number => {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(now);
    const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value);

    const h = getPart("hour");
    const m = getPart("minute");

    if (isNaN(h) || isNaN(m)) throw new Error("Invalid time parts");
    return h * 60 + m;
  } catch (error) {
    console.warn(`Timezone "${timeZone}" failed, falling back to local time.\n${error instanceof Error ? error.message : String(error)}`);
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
};

/**
 * Checks whether `now` (minutes since midnight) is in the half-open range
 * `[start, end)`, supporting ranges that wrap past midnight.
 */
export const isTimeInRange = (
  now: number,
  start: number,
  end: number
): boolean => {
  if (start < end) {
    return now >= start && now < end;
  }
  return now >= start || now < end;
};

/**
 * Normalizes a time value for display.
 * Returns an em dash when the value is missing/blank or not a string.
 */
export const formatTime = (value: unknown): string => {
  if (typeof value !== "string") return "—";
  const trimmed = value.trim();
  return trimmed ? trimmed : "—";
};

/**
 * Formats a date into `YYYY-MM-DD` using the given IANA timezone.
 */
export const formatYmd = (date: Date, timeZone: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Returns true when `date` is the same calendar day as `now` in the given IANA timezone.
 */
export const isToday = (
  date: Date,
  timeZone: string,
  now: Date = new Date()
): boolean => {
  return formatYmd(date, timeZone) === formatYmd(now, timeZone);
};

/**
 * Formats a date into `YYYY-MM` using the given IANA timezone.
 */
export const formatYm = (date: Date, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  if (!year || !month) {
    throw new Error("Could not format current month");
  }

  return `${year}-${month}`;
};

/**
 * Formats a date into a localized long date string (e.g. "25 de mayo de 2024")
 * in the given IANA timezone and language.
 */
export const formatLongDate = (
  date: Date,
  timeZone: string,
  languageCode: string
): string => {
  return new Intl.DateTimeFormat(languageCode, {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Formats a date using the Islamic (Hijri) calendar in the given language and timezone.
 * Uses Latin digits and strips the trailing era marker (e.g. "AH", "A.H.") that some
 * locales append.
 */
export const formatHijriDate = (
  date: Date,
  timeZone: string,
  languageCode: string
): string => {
  const locale = `${languageCode}-u-ca-islamic-nu-latn`;

  const formatted = new Intl.DateTimeFormat(locale, {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.replace(/\s*A\.?H\.?\s*$/i, "").trim();
};

/**
 * Builds a stable "anchor" date for a given `YYYY-MM` string and month offset.
 *
 * The returned date is set to the 15th at 12:00 UTC to avoid edge cases around
 * month boundaries and DST when later formatted in a timezone.
 */
export const getMonthAnchorDate = (
  ym: string | null | undefined,
  offsetMonths: number
): Date => {
  const safeYm = typeof ym === "string" ? ym : "";
  const [y, m] = safeYm.split("-").map((part) => Number.parseInt(part, 10));
  const baseYear = Number.isFinite(y) ? y : new Date().getUTCFullYear();
  const baseMonthIndex = Number.isFinite(m) ? m - 1 : new Date().getUTCMonth();
  return new Date(Date.UTC(baseYear, baseMonthIndex + offsetMonths, 15, 12, 0, 0));
};

/**
 * Formats a month label like "March 2026" in the given language and timezone,
 * then capitalizes the first character.
 */
export const buildMonthLabel = (
  date: Date,
  languageCode: string,
  timeZone: string
): string => {
  const raw = new Intl.DateTimeFormat(languageCode, {
    timeZone,
    month: "long",
    year: "numeric",
  }).format(date);

  return raw.length > 0 ? `${raw[0].toUpperCase()}${raw.slice(1)}` : raw;
};

/**
 * Builds a month navigation HREF by copying a base URL and setting the `date`
 * search parameter to the provided `YYYY-MM` value.
 */
export const buildMonthHref = (ym: string, baseUrl: URL): string => {
  const url = new URL(baseUrl);
  url.searchParams.set("date", ym);
  return `${url.pathname}${url.search}`;
};
