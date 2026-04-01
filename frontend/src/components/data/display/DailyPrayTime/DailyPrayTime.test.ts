import { getByRole, getByText } from "@testing-library/dom";
import {
  installDomGlobals,
  renderAstroComponentToDom,
} from "@utils/test.helpers";

import DailyPrayTime from "./DailyPrayTime.astro";

let nowMinutes = 0;

vi.mock("@utils/time.utils", async () => {
  const actual
    = await vi.importActual<typeof import("@utils/time.utils")>("@utils/time.utils");

  return {
    ...actual,
    getCurrentMinutes: (): number => nowMinutes,
  };
});

describe("DailyPrayTime", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render location, dates, help link, and 6 prayer items when props are provided", async () => {
    const props = {
      location: "Bogotá D.C., Colombia",
      hijriDate: "15 Dhu al-Qi'dah",
      currentDate: "25 de Mayo, 2024",
      timeZone: "America/Bogota",
      schedule: {
        fajr: "05:40",
        sunrise: "06:15",
        dhuhr: "12:00",
        asr: "15:40",
        maghrib: "18:20",
        isha: "20:40",
      },
    };

    const { root, close } = await renderAstroComponentToDom(DailyPrayTime, {
      props,
    });

    try {
      expect(getByText(root, props.location)).toBeInTheDocument();
      expect(getByText(root, `${props.currentDate} • ${props.hijriDate}`)).toBeInTheDocument();
      expect(getByText(root, "Horario de Oración")).toBeInTheDocument();

      const helpLink = getByRole(root, "link", {
        name: "Sobre los Horarios de Oración",
      });
      expect(helpLink.getAttribute("href")).toBe("/how-to-calculate-pray-times");

      const scheduleRoot = root.querySelector<HTMLElement>("[data-prayer-schedule]");
      if (!scheduleRoot) {
        throw new Error("Expected DailyPrayTime to render a root [data-prayer-schedule]");
      }

      expect(scheduleRoot.dataset.timezone).toBe(props.timeZone);
      expect(scheduleRoot.dataset.sunrise).toBe(props.schedule.sunrise);

      const items
        = scheduleRoot.querySelectorAll<HTMLElement>("[data-prayer-item]");
      expect(items.length).toBe(6);

      const fajr = scheduleRoot.querySelector<HTMLElement>("[data-prayer-item][data-prayer=\"fajr\"]");
      if (!fajr) {
        throw new Error("Expected DailyPrayTime to render a fajr item");
      }

      expect(fajr.getAttribute("data-time")).toBe(props.schedule.fajr);
    }
    finally {
      await close();
    }
  });

  it("should highlight the active prayer when the controller runs", async () => {
    nowMinutes = 13 * 60;

    const { window, root, close } = await renderAstroComponentToDom(
      DailyPrayTime,
      {
        props: {
          location: "Bogotá D.C., Colombia",
          hijriDate: "15 Dhu al-Qi'dah",
          currentDate: "25 de Mayo, 2024",
          timeZone: "America/Bogota",
          schedule: {
            fajr: "05:40",
            sunrise: "06:15",
            dhuhr: "12:00",
            asr: "15:40",
            maghrib: "18:20",
            isha: "20:40",
          },
        },
      }
    );

    try {
      installDomGlobals(window, window.document);

      const { initDailyPrayerTimes }
        = await import("./daily-pray-time.controller");
      initDailyPrayerTimes();
      await vi.runOnlyPendingTimersAsync();

      const active = root.querySelector<HTMLElement>("[data-prayer-item][data-prayer=\"dhuhr\"]");
      if (!active) {
        throw new Error("Expected a dhuhr item to exist");
      }

      expect(active.hasAttribute("data-prayer-item-active")).toBe(true);
      expect(active.getAttribute("aria-current")).toBe("time");

      const label = active.querySelector<HTMLElement>("[data-prayer-label]");
      if (!label) {
        throw new Error("Expected the active prayer item to include a [data-prayer-label]");
      }
      expect(label.hasAttribute("data-prayer-label-active")).toBe(true);

      const fajr = root.querySelector<HTMLElement>("[data-prayer-item][data-prayer=\"fajr\"]");
      if (!fajr) {
        throw new Error("Expected a fajr item to exist");
      }
      expect(fajr.hasAttribute("data-prayer-item-active")).toBe(false);
    }
    finally {
      await close();
    }
  });

  it("should not highlight any prayer during the post-sunrise prohibited window when the controller runs", async () => {
    nowMinutes = 6 * 60 + 16;

    const { window, root, close } = await renderAstroComponentToDom(
      DailyPrayTime,
      {
        props: {
          location: "Bogotá D.C., Colombia",
          hijriDate: "15 Dhu al-Qi'dah",
          currentDate: "25 de Mayo, 2024",
          timeZone: "America/Bogota",
          schedule: {
            fajr: "05:40",
            sunrise: "06:15",
            dhuhr: "12:00",
            asr: "15:40",
            maghrib: "18:20",
            isha: "20:40",
          },
        },
      }
    );

    try {
      installDomGlobals(window, window.document);

      const { initDailyPrayerTimes }
        = await import("./daily-pray-time.controller");
      initDailyPrayerTimes();
      await vi.runOnlyPendingTimersAsync();

      expect(root.querySelector("[data-prayer-item-active]")).toBeNull();
    }
    finally {
      await close();
    }
  });
});
