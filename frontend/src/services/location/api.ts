import type { TServiceLocation } from "@utils/models/location";
import { LOCATION_API_URL } from "astro:env/client";

/**
 * Fetches coarse location metadata (city/country/timezone) from `LOCATION_API_URL`.
 * Intended to complement browser geolocation (lat/lon) with human-readable metadata.
 */
export const fetchLocationData = async (): Promise<TServiceLocation> => {
  const res = await fetch(LOCATION_API_URL);

  if (!res.ok) {
    throw new Error(`Location API request failed (${String(res.status)})`);
  }

  return (await res.json()) as unknown as TServiceLocation;
};
