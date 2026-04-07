import type { TDailyPrayer } from "./models/types";
import { isTimeInRange } from "./time.utils";

export const CONFIG = {
  zawalMinutes: 10,
  sunriseBufferMinutes: 15,
  sunsetBufferMinutes: 5,
  updateIntervalMs: 30_000,
} as const;

export function calculateActivePrayer(
  now: number,
  times: Record<TDailyPrayer, number | null>,
  sunriseMin: number | null
): TDailyPrayer | null {
  const { fajr, dhuhr, asr, maghrib, isha } = times;

  if (sunriseMin !== null) {
    if (
      isTimeInRange(now, sunriseMin, sunriseMin + CONFIG.sunriseBufferMinutes)
    ) {
      return null;
    }
  }

  if (dhuhr !== null) {
    const zawalStart = dhuhr - CONFIG.zawalMinutes;
    if (isTimeInRange(now, zawalStart, dhuhr)) return null;
  }

  if (maghrib !== null) {
    const sunsetStart = maghrib - CONFIG.sunsetBufferMinutes;
    if (isTimeInRange(now, sunsetStart, maghrib)) return null;
  }

  if (isha !== null && (now >= isha || (fajr !== null && now < fajr))) {
    return "isha";
  }
  if (fajr !== null && dhuhr !== null && now >= fajr && now < dhuhr) {
    return "fajr";
  }
  if (dhuhr !== null && asr !== null && now >= dhuhr && now < asr) {
    return "dhuhr";
  }
  if (asr !== null && maghrib !== null && now >= asr && now < maghrib) {
    return "asr";
  }
  if (maghrib !== null && isha !== null && now >= maghrib && now < isha) {
    return "maghrib";
  }

  return null;
}
