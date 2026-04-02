import type { TIslamicApiPrayerTimes } from "@utils/models/islamic";
import type { TDailyPrayerSchedule } from "@utils/models/types";
import { formatHijriDate, formatLongDate } from "@utils/time.utils";

const parsePrayerTimes = (times: TIslamicApiPrayerTimes): TDailyPrayerSchedule => ({
  fajr: times.Fajr,
  sunrise: times.Sunrise,
  dhuhr: times.Dhuhr,
  asr: times.Asr,
  maghrib: times.Maghrib,
  isha: times.Isha,
});

export type BuildPrayerDataParams = {
  times: TIslamicApiPrayerTimes;
  city: string;
  country: string;
  timeZone: string;
  date: Date;
  languageCode?: string;
  fetchedAt?: string;
};

export const buildPrayerData = ({
  times,
  city,
  country,
  timeZone,
  date,
  languageCode = "es",
  fetchedAt = new Date().toISOString(),
}: BuildPrayerDataParams) => ({
  fetchedAt,
  location: `${city}, ${country}`,
  currentDate: formatLongDate(date, timeZone, languageCode),
  hijriDate: formatHijriDate(date, timeZone, languageCode),
  times: parsePrayerTimes(times),
});
