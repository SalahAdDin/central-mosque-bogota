import { getClientLocation } from "@utils/location.utils";
import type {
  TIslamicApiPrayerTimeMonthResponse,
  TIslamicApiPrayerTimeSingleResponse,
  TIslamicResponse,
} from "@utils/models/islamic";
import type { LiveLoader } from "astro/loaders";

import { buildPrayerData } from "../adaptor/buildPrayerData";
import { fetchIslamicData } from "../api";

type FetchPrayerParams = {
  date?: string;
  languageCode?: string;
  isMonthly: boolean;
};

type LoaderResponse = TIslamicResponse & {
  fetchedAt: string;
};
type LoaderExpectedResponse = { id: string; data: LoaderResponse };
type LoaderError = { error: Error };

type LoaderEntryResult = {
  type: "entry";
  result: LoaderExpectedResponse;
};
type LoaderCollectionResult = {
  type: "collection";
  result: Array<LoaderExpectedResponse>;
};

type LoaderSuccessResult = LoaderEntryResult | LoaderCollectionResult;
type LoaderResult = LoaderSuccessResult | LoaderError;

type LoaderConfig = {
  languageCode?: string;
  date?: string;
};

type EntryFilter = {
  date?: string;
  languageCode?: string;
};

/**
 * Fetches either daily or monthly prayer times from IslamicAPI and adapts them to the
 * internal `LoaderResponse` shape used by the live content collection.
 *
 * Returns a discriminated union so callers can narrow `result` based on `type`.
 */
const fetchPrayerTimes = async ({
  date,
  languageCode = "es",
  isMonthly,
}: FetchPrayerParams): Promise<LoaderResult> => {
  try {
    const { lat, lon, city, country, timeZone } = await getClientLocation();

    const endpoint = "prayer-time/";
    const params = {
      lat,
      lon,

      // TODO: handle from BE
      method: "3",
      school: "1",
      calender: "MATHEMATICAL",
      shifting: "0",
      date,
    };

    const currentDate = date ? new Date(date) : new Date();

    if (isMonthly) {
      const { data }
        = await fetchIslamicData<TIslamicApiPrayerTimeMonthResponse>(
          endpoint,
          params
        );

      return {
        type: "collection",
        result: data.map(entry => ({
          id: `${currentDate.toISOString()}-${entry.date}`, // Unique ID per day in month
          data: buildPrayerData({
            times: entry.times,
            city,
            country,
            timeZone,
            languageCode,
            date: new Date(entry.date),
          }),
        })),
      };
    }
    else {
      const { data }
        = await fetchIslamicData<TIslamicApiPrayerTimeSingleResponse>(
          endpoint,
          params
        );

      return {
        type: "entry",
        result: {
          id: currentDate.toISOString(),
          data: buildPrayerData({
            times: data.times,
            city,
            country,
            timeZone,
            languageCode,
            date: currentDate,
          }),
        },
      };
    }
  }
  catch (error) {
    return {
      error: new Error(
        `Failed to load ${isMonthly ? "monthly" : "daily"} prayer times`,
        { cause: error }
      ),
    };
  }
};

/**
 * Astro live loader for the `prayerTimes` collection.
 *
 * - `loadEntry`: fetches a single day (uses `filter.date` when provided)
 * - `loadCollection`: fetches a whole month (requires `config.date` in `YYYY-MM` format)
 */
export function prayerTimesLoader(config: LoaderConfig = {}): LiveLoader<LoaderResponse, EntryFilter> {
  return {
    name: "prayer-times-loader",

    loadCollection: async () => {
      const { date, languageCode } = config;

      if (!date || !/^\d{4}-\d{2}$/.test(date)) {
        return {
          error: new Error("Date parameter in YYYY-MM format is required"),
        };
      }

      const response = await fetchPrayerTimes({
        date,
        languageCode,
        isMonthly: true,
      });

      if ("error" in response) return response;
      if (response.type !== "collection") {
        return {
          error: new Error("Unexpected response type for collection"),
        };
      }

      return { entries: response.result };
    },

    loadEntry: async ({ filter }) => {
      const { date, languageCode } = filter;

      const response = await fetchPrayerTimes({
        date,
        languageCode,
        isMonthly: false,
      });

      if ("error" in response) return response;
      if (response.type !== "entry") {
        return {
          error: new Error("Unexpected response type for single entry"),
        };
      }

      return response.result;
    },
  };
}
