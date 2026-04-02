import {
  ISLAMIC_API_ASR_SCHOOLS,
  ISLAMIC_API_CALENDAR_METHODS,
  ISLAMIC_API_HIJRI_SHIFTS,
  ISLAMIC_API_PRAYER_CALCULATION_METHODS,
  ISLAMIC_API_STATUSES,
} from "@utils/models.constants";

import type { TDailyPrayerSchedule } from "./types";

export type TIslamicApiDateYm = `${number}-${number}`;
export type TIslamicApiDateYmd = `${number}-${number}-${number}`;
export type TIslamicApiPrayerTimeDateParam
  = | TIslamicApiDateYmd
    | TIslamicApiDateYm;

export type TIslamicApiPrayerCalculationMethod
  = (typeof ISLAMIC_API_PRAYER_CALCULATION_METHODS)[number];

export type TIslamicApiAsrSchool = (typeof ISLAMIC_API_ASR_SCHOOLS)[number];

export type TIslamicApiCalendarMethod
  = (typeof ISLAMIC_API_CALENDAR_METHODS)[number];

export type TIslamicApiHijriShift = (typeof ISLAMIC_API_HIJRI_SHIFTS)[number];

export type TIslamicApiPrayerTimeQueryParams = {
  lat: string;
  lon: string;
  method?: `${TIslamicApiPrayerCalculationMethod}`;
  school?: `${TIslamicApiAsrSchool}`;
  calender?: TIslamicApiCalendarMethod;
  shifting?: `${TIslamicApiHijriShift}`;
  date?: TIslamicApiPrayerTimeDateParam;
};

export type TIslamicApiStatus = (typeof ISLAMIC_API_STATUSES)[number];

export type TIslamicApiErrorResponse = {
  code: number;
  status: "error";
  message: string;
};

export type TIslamicApiSuccessResponse<TData> = {
  code: number;
  status: "success";
  data: TData;
};

export type TIslamicApiDesignation = {
  abbreviated: string;
  expanded: string;
};

export type TIslamicApiWeekday = {
  en: string;
  ar?: string;
};

export type TIslamicApiMonth = {
  number: number;
  en: string;
  ar?: string;
  days?: number;
};

export type TIslamicApiHijriDate = {
  date: string;
  format?: string;
  day: string;
  weekday?: TIslamicApiWeekday;
  month: TIslamicApiMonth;
  year: string;
  designation?: TIslamicApiDesignation;
  holidays?: Array<string>;
  adjustedHolidays?: Array<string>;
  method?: string;
};

export type TIslamicApiGregorianDate = {
  date: string;
  format?: string;
  day: string;
  weekday?: { en: string };
  month: { number: number; en: string };
  year: string;
  designation?: TIslamicApiDesignation;
};

export type TIslamicApiPrayerTimeDate = {
  readable: string;
  timestamp: string;
  hijri: TIslamicApiHijriDate;
  gregorian: TIslamicApiGregorianDate;
};

export type TIslamicApiPrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunset?: string;
  Imsak?: string;
  Midnight?: string;
  Firstthird?: string;
  Lastthird?: string;
} & Record<string, string>;

export type TIslamicApiTimeRange = {
  start: string;
  end: string;
};

export type TIslamicApiProhibitedTimes = {
  sunrise: TIslamicApiTimeRange;
  noon: TIslamicApiTimeRange;
  sunset: TIslamicApiTimeRange;
};

export type TIslamicApiQibla = {
  direction: {
    degrees: number;
    from: string;
    clockwise: boolean;
  };
  distance: {
    value: number;
    unit: string;
  };
};

export type TIslamicApiTimezone = {
  name: string;
  utc_offset: string;
  abbreviation: string;
};

export type TIslamicApiPrayerTimeSingleDayData = {
  date: TIslamicApiPrayerTimeDate;
  times: TIslamicApiPrayerTimes;
  prohibited_times: TIslamicApiProhibitedTimes;
  qibla: TIslamicApiQibla;
  timezone: TIslamicApiTimezone;
};

export type TIslamicApiPrayerTimeMonthDayData = {
  date: string;
  times: TIslamicApiPrayerTimes;
  hijri_date: TIslamicApiPrayerTimeDate;
  prohibited_times: TIslamicApiProhibitedTimes;
};

export type TIslamicApiPrayerTimeSingleResponse
  = TIslamicApiSuccessResponse<TIslamicApiPrayerTimeSingleDayData>;

export type TIslamicApiPrayerTimeMonthResponse = {
  code: number;
  status: "success";
  data: Array<TIslamicApiPrayerTimeMonthDayData>;
  qibla: TIslamicApiQibla;
  timezone: TIslamicApiTimezone;
};

export type TIslamicApiPrayerTimeResponse
  = | TIslamicApiPrayerTimeSingleResponse
    | TIslamicApiPrayerTimeMonthResponse
    | TIslamicApiErrorResponse;

export type TIslamicResponse = {
  location: string;
  hijriDate: string;
  currentDate: string;
  times: TDailyPrayerSchedule;
};
