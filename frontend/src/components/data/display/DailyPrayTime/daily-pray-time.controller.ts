import {
  getCurrentMinutes,
  isTimeInRange,
  parseTimeToMinutes,
} from "@utils/time.utils";
import { DAILY_PRAYERS } from "@utils/ui.constants";

const CONFIG = {
  zawalMinutes: 10,
  sunriseBufferMinutes: 15,
  sunsetBufferMinutes: 5,
  updateIntervalMs: 30_000,
} as const;

const VALID_PRAYERS = DAILY_PRAYERS;
type ValidPrayerKey = (typeof VALID_PRAYERS)[number];

let updateTimer: number | null = null;

function calculateActivePrayer(
  now: number,
  times: Record<ValidPrayerKey, number | null>,
  sunriseMin: number | null
): ValidPrayerKey | null {
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

function updateUI(root: HTMLElement): void {
  const timeZone = root.dataset.timezone ?? "America/Bogota";
  const sunriseStr = root.dataset.sunrise;
  const now = getCurrentMinutes(timeZone);

  const times: Record<ValidPrayerKey, number | null> = {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
  };

  const prayerNodes = new Map<
    ValidPrayerKey,
    { el: HTMLElement; label: HTMLElement | null }
  >();

  for (const el of root.querySelectorAll<HTMLElement>("[data-prayer-item]")) {
    const key = el.getAttribute("data-prayer");
    if (!key || !VALID_PRAYERS.includes(key as ValidPrayerKey)) continue;

    const timeStr = el.getAttribute("data-time");
    const label = el.querySelector<HTMLElement>("[data-prayer-label]");

    times[key as ValidPrayerKey] = parseTimeToMinutes(timeStr);
    prayerNodes.set(key as ValidPrayerKey, { el, label });
  }

  const sunriseMin = parseTimeToMinutes(sunriseStr);
  const activeKey = calculateActivePrayer(now, times, sunriseMin);

  for (const [key, node] of prayerNodes.entries()) {
    const isActive = key === activeKey;

    node.el.toggleAttribute("data-prayer-item-active", isActive);

    if (isActive) node.el.setAttribute("aria-current", "time");
    else node.el.removeAttribute("aria-current");

    if (node.label) {
      node.label.toggleAttribute("data-prayer-label-active", isActive);
    }
  }
}

export function initDailyPrayerTimes(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-prayer-schedule]"));
  if (roots.length === 0) return;

  for (const root of roots) updateUI(root);

  if (updateTimer !== null) window.clearInterval(updateTimer);
  updateTimer = window.setInterval(() => {
    const nextRoots = Array.from(document.querySelectorAll<HTMLElement>("[data-prayer-schedule]"));
    for (const root of nextRoots) updateUI(root);
  }, CONFIG.updateIntervalMs);
}
