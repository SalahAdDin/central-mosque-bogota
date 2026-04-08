import { getAllByRole, getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import MonthlyPrayTime from "./MonthlyPrayTime.astro";

let close: (() => Promise<void>) | null = null;

describe("MonthlyPrayTime", () => {
  afterEach(async () => {
    if (close) await close();
    close = null;
  });

  it("should render location, month label, and a prayer times table when props are provided", async () => {
    const props = {
      location: "Bogotá D.C., Colombia",
      monthLabel: "Marzo 2024",
      dateHeaderLabel: "Fecha",
      todayBadgeLabel: "Hoy",
      rows: [
        {
          currentDate: "12 de marzo de 2024",
          hijriDate: "1 de Ramadán de 1445",
          isToday: true,
          times: {
            fajr: "04:52",
            sunrise: "06:01",
            dhuhr: "12:09",
            asr: "15:17",
            maghrib: "18:13",
            isha: "19:21",
          },
        },
        {
          currentDate: "13 de marzo de 2024",
          hijriDate: "2 de Ramadán de 1445",
          times: {
            fajr: "04:53",
            sunrise: "06:01",
            dhuhr: "12:09",
            asr: "15:17",
            maghrib: "18:13",
            isha: "19:21",
          },
        },
      ],
    };

    const rendered = await renderAstroComponentToDom(MonthlyPrayTime, {
      props,
    });
    close = rendered.close;

    const { root } = rendered;

    expect(getByText(root, props.location, { exact: false })).toBeInTheDocument();
    expect(getByText(root, props.monthLabel)).toBeInTheDocument();

    const table = getByRole(root, "table");
    expect(table).toBeInTheDocument();

    expect(getByText(table, props.dateHeaderLabel)).toBeInTheDocument();
    expect(getByText(table, "Fajr")).toBeInTheDocument();
    expect(getByText(table, "Amanecer")).toBeInTheDocument();
    expect(getByText(table, "Dhuhr")).toBeInTheDocument();
    expect(getByText(table, "Asr")).toBeInTheDocument();
    expect(getByText(table, "Maghrib")).toBeInTheDocument();
    expect(getByText(table, "Isha")).toBeInTheDocument();

    const rows = getAllByRole(table, "row");
    expect(rows.length).toBe(1 + props.rows.length);

    expect(getByText(table, props.todayBadgeLabel)).toBeInTheDocument();

    const todayRow = root.querySelector<HTMLElement>("[data-monthly-pray-row='today']");
    expect(todayRow).toBeTruthy();
    if (!todayRow)
      throw new Error("Expected MonthlyPrayTime to render a today row");

    const todayCells = todayRow.querySelectorAll<HTMLElement>("[data-monthly-pray-cell='true'][data-prayer][data-time]");
    expect(todayCells.length).toBe(6);

    const allTodayCells = root.querySelectorAll<HTMLElement>("[data-monthly-pray-cell='true']");
    expect(allTodayCells.length).toBe(6);
  });
});
