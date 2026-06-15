import {
  getAllByRole,
  getAllByText,
  getByRole,
  getByText,
} from "@testing-library/dom";
import {
  installDomGlobals,
  installMatchMedia,
  renderAstroComponentToDom,
} from "@utils/test.helpers";

import MonthlyPrayTime from "./MonthlyPrayTime.astro";

type MonthlyEntry = {
  id: string;
  data: {
    fetchedAt: string;
    location: string;
    currentDate: string;
    hijriDate: string;
    isToday: boolean;
    activePray: string | undefined;
    times: Record<string, string>;
  };
};

const { state, makeEntry, locationLabel } = vi.hoisted(() => {
  const location = "Bogotá D.C., Colombia";
  const times = {
    fajr: "04:52",
    sunrise: "06:01",
    dhuhr: "12:09",
    asr: "15:17",
    maghrib: "18:13",
    isha: "19:21",
  };

  const makeEntry = (day: number, isToday: boolean): MonthlyEntry => ({
    id: `2024-03-${String(day).padStart(2, "0")}`,
    data: {
      fetchedAt: "2024-03-01T00:00:00.000Z",
      location,
      currentDate: `${String(day)} de marzo de 2024`,
      hijriDate: `${String(day)} de Ramadán de 1445`,
      isToday,
      activePray: isToday ? "maghrib" : undefined,
      times,
    },
  });

  // Mutable so each test can control how many entries the component receives.
  return {
    state: { entries: [makeEntry(12, true)] as Array<MonthlyEntry> },
    makeEntry,
    locationLabel: location,
  };
});

vi.mock("astro:content", () => ({
  getLiveCollection: vi.fn(() => Promise.resolve({ entries: state.entries })),
}));

vi.mock("@utils/location.utils", async () => {
  const actual = await vi.importActual<typeof import("@utils/location.utils")>(
    "@utils/location.utils"
  );

  return {
    ...actual,
    getClientLocation: vi.fn(() =>
      Promise.resolve({
        ...actual.BOGOTA_LOCATION,
        timeZone: "America/Bogota",
      })
    ),
  };
});

describe("MonthlyPrayTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Pin the clock so the computed month label is deterministic.
    vi.setSystemTime(new Date("2024-03-12T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render location, month label, and a prayer times table when entries come from the live collection", async () => {
    state.entries = [makeEntry(12, true), makeEntry(13, false)];

    const { root, close } = await renderAstroComponentToDom(MonthlyPrayTime);

    try {
      expect(
        getByText(root, locationLabel, { exact: false })
      ).toBeInTheDocument();
      // The active month label appears in both the dropdown trigger and the
      // disabled "current" dropdown item.
      expect(getAllByText(root, "Marzo de 2024").length).toBeGreaterThan(0);

      const table = getByRole(root, "table");
      expect(table).toBeInTheDocument();

      expect(getByText(table, "Fecha")).toBeInTheDocument();
      expect(getByText(table, "Fajr")).toBeInTheDocument();
      expect(getByText(table, "Amanecer")).toBeInTheDocument();
      expect(getByText(table, "Dhuhr")).toBeInTheDocument();
      expect(getByText(table, "Asr")).toBeInTheDocument();
      expect(getByText(table, "Maghrib")).toBeInTheDocument();
      expect(getByText(table, "Isha")).toBeInTheDocument();

      const rows = getAllByRole(table, "row");
      expect(rows.length).toBe(1 + state.entries.length);

      expect(getByText(table, "Hoy")).toBeInTheDocument();

      const todayRow = root.querySelector<HTMLElement>(
        "[data-monthly-pray-row='today']"
      );
      expect(todayRow).toBeTruthy();
      if (!todayRow)
        throw new Error("Expected MonthlyPrayTime to render a today row");

      const todayCells = todayRow.querySelectorAll<HTMLElement>(
        "[data-monthly-pray-cell='true'][data-prayer][data-time]"
      );
      expect(todayCells.length).toBe(6);

      const allTodayCells = root.querySelectorAll<HTMLElement>(
        "[data-monthly-pray-cell='true']"
      );
      expect(allTodayCells.length).toBe(6);
    } finally {
      await close();
    }
  });

  it("should toggle the expanded state when the show-more button is clicked and the controller runs", async () => {
    // More than COLLAPSED_ROWS (7) so the toggle is shown.
    state.entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(i + 1, i === 0)
    );

    const { window, root, close } =
      await renderAstroComponentToDom(MonthlyPrayTime);

    try {
      installDomGlobals(window, window.document);
      installMatchMedia(window);

      const { initMonthlyPrayTimes } =
        await import("./monthly-pray-time.controller");
      initMonthlyPrayTimes();

      const tableRoot = root.querySelector<HTMLElement>(
        "[data-monthly-table-root]"
      );
      const toggle = root.querySelector<HTMLButtonElement>(
        "[data-action=show-more]"
      );
      if (!tableRoot || !toggle) {
        throw new Error("Expected a table root and a show-more toggle");
      }

      // Starts collapsed.
      expect(tableRoot.dataset.monthlyExpanded).toBe("false");
      expect(toggle.getAttribute("aria-expanded")).toBe("false");

      // First click expands.
      toggle.click();
      expect(tableRoot.dataset.monthlyExpanded).toBe("true");
      expect(toggle.getAttribute("aria-expanded")).toBe("true");

      // Second click collapses again.
      toggle.click();
      expect(tableRoot.dataset.monthlyExpanded).toBe("false");
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
    } finally {
      await close();
    }
  });
});
