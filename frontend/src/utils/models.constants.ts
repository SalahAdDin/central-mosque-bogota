// See https://islamicapi.com/doc/prayer-time/
export const ISLAMIC_API_PRAYER_CALCULATION_METHODS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
] as const;

export const ISLAMIC_API_CALENDAR_METHODS = [
  "HJCoSA",
  "HJCOSA",
  "UAQ",
  "DIYANET",
  "MATHEMATICAL",
] as const;

export const ISLAMIC_API_ASR_SCHOOLS = [1, 2] as const;

export const ISLAMIC_API_HIJRI_SHIFTS = [-2, -1, 0, 1, 2] as const;

export const ISLAMIC_API_STATUSES = ["success", "error"] as const;
