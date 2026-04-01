import preview from "@storybook/preview";

import DailyPrayTime from "./DailyPrayTime.astro";

const meta = preview.meta({
  title: "Components/Data/Display/DailyPrayTime",
  // https://github.com/storybook-astro/storybook-astro/issues/61
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: DailyPrayTime,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
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
});

export const Default = meta.story({});

export const MissingSunrise = meta.story({
  args: {
    schedule: {
      fajr: "05:40",
      sunrise: "",
      dhuhr: "12:00",
      asr: "15:40",
      maghrib: "18:20",
      isha: "20:40",
    },
  },
});
