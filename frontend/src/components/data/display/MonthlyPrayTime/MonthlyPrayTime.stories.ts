import preview from "@storybook/preview";

import MonthlyPrayTime from "./MonthlyPrayTime.astro";

const meta = preview.meta({
  title: "Components/Data/Display/MonthlyPrayTime",
  // https://github.com/storybook-astro/storybook-astro/issues/61
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: MonthlyPrayTime,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    location: "Bogotá D.C., Colombia",
    monthLabel: "Marzo 2024",
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
      {
        currentDate: "14 de marzo de 2024",
        hijriDate: "3 de Ramadán de 1445",
        times: {
          fajr: "04:53",
          sunrise: "06:02",
          dhuhr: "12:09",
          asr: "15:17",
          maghrib: "18:13",
          isha: "19:21",
        },
      },
    ],
  },
});

export const Default = meta.story({});
