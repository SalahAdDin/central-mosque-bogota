import { calculateActivePrayer } from "@utils/islamic.utils";
import type { TIslamicApiPrayerTimes } from "@utils/models/islamic";
import type { TDailyPrayerSchedule } from "@utils/models/types";
import {
  formatHijriDate,
  formatLongDate,
  getCurrentMinutes,
  isToday,
  parseTimeToMinutes,
} from "@utils/time.utils";

const parsePrayerTimes = (times: TIslamicApiPrayerTimes): TDailyPrayerSchedule => ({
  fajr: times.Fajr,
  sunrise: times.Sunrise,
  dhuhr: times.Dhuhr,
  asr: times.Asr,
  maghrib: times.Maghrib,
  isha: times.Isha,
});

const parsePrayerTimesToNumber = (times: TDailyPrayerSchedule) => ({
  fajr: parseTimeToMinutes(times.fajr),
  sunrise: parseTimeToMinutes(times.sunrise),
  dhuhr: parseTimeToMinutes(times.dhuhr),
  asr: parseTimeToMinutes(times.asr),
  maghrib: parseTimeToMinutes(times.maghrib),
  isha: parseTimeToMinutes(times.isha),
});

export type BuildPrayerDataParams = {
  times: TIslamicApiPrayerTimes;
  city: string;
  country: string;
  date: Date;
  languageCode?: string;
  fetchedAt?: string;
};

export const buildPrayerData = ({
  times,
  city,
  country,
  date,
  languageCode = "es",
  fetchedAt = new Date().toISOString(),
}: BuildPrayerDataParams) => {
  const today = isToday(date, "UTC");
  const parsedTimes = parsePrayerTimes(times);
  const activePray = today
    ? calculateActivePrayer(
        getCurrentMinutes("UTC"),
        parsePrayerTimesToNumber(parsedTimes),
        parseTimeToMinutes(parsedTimes.sunrise)
      )
    : undefined;

  return {
    fetchedAt,
    location: `${city}, ${country}`,
    currentDate: formatLongDate(date, "UTC", languageCode),
    hijriDate: formatHijriDate(date, "UTC", languageCode),
    isToday: today,
    activePray,
    times: parsedTimes,
  };
};
