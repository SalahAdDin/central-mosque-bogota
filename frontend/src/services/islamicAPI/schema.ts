import { z } from "astro/zod";

export const prayerTimeEntrySchema = z.object({
  fetchedAt: z.string(),
  location: z.string(),
  currentDate: z.string(),
  hijriDate: z.string(),
  isToday: z.boolean().optional(),
  activePray: z.string().optional(),
  times: z.object({
    fajr: z.string(),
    sunrise: z.string(),
    dhuhr: z.string(),
    asr: z.string(),
    maghrib: z.string(),
    isha: z.string(),
  }),
});
