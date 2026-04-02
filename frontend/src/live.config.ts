import { prayerTimesLoader } from "@services/islamicAPI/loaders/prayerTimesLoader";
import { prayerTimeEntrySchema } from "@services/islamicAPI/schema";
import { defineLiveCollection } from "astro:content";

const prayerTimes = defineLiveCollection({
  loader: prayerTimesLoader(),
  schema: prayerTimeEntrySchema,
});

export const collections = {
  prayerTimes,
};
