import { z } from "astro/zod";

export const prayerTimeEntrySchema = z.object({
  fetchedAt: z.string(),
  location: z.string(),
  currentDate: z.string(),
  hijriDate: z.string(),
  times: z.object({
    fajr: z.string(),
    sunrise: z.string(),
    dhuhr: z.string(),
    asr: z.string(),
    maghrib: z.string(),
    isha: z.string(),
  }),
});
