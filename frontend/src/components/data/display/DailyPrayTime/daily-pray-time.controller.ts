import { calculateActivePrayer, CONFIG } from "@utils/islamic.utils";
import type { TDailyPrayer } from "@utils/models/types";
import { getCurrentMinutes, parseTimeToMinutes } from "@utils/time.utils";
import { DAILY_PRAYERS } from "@utils/ui.constants";

let updateTimer: number | null = null;

function updateUI(root: HTMLElement): void {
  const timeZone = root.dataset.timezone ?? "America/Bogota";
  const sunriseStr = root.dataset.sunrise;
  const now = getCurrentMinutes(timeZone);

  const times: Record<TDailyPrayer, number | null> = {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
  };

  const prayerNodes = new Map<
    TDailyPrayer,
    { el: HTMLElement; label: HTMLElement | null }
  >();

  for (const el of root.querySelectorAll<HTMLElement>("[data-prayer-item]")) {
    const key = el.getAttribute("data-prayer");
    if (!key || !DAILY_PRAYERS.includes(key as TDailyPrayer)) continue;

    const timeStr = el.getAttribute("data-time");
    const label = el.querySelector<HTMLElement>("[data-prayer-label]");

    times[key as TDailyPrayer] = parseTimeToMinutes(timeStr);
    prayerNodes.set(key as TDailyPrayer, { el, label });
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
