export const LOCATION_CONFIG = {
  DEFAULT_TIMEOUT_MS: 5_000,
  CACHE_TTL_MS: 10 * 60 * 1_000, // 10 minutes
} as const;

export const BOGOTA_LOCATION = {
  lat: "4.7110",
  lon: "-74.0721",
  timeZone: "America/Bogota",
  city: "Bogotá D.C.",
  country: "Colombia",
} as const;

import { fetchLocationData } from "@services/location/api";

import type { TClientLocation } from "./models/location";

let locationCache: {
  data: TClientLocation | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

/**
 * Checks whether the in-memory location cache is still fresh (not expired).
 */
const isCacheValid = (): boolean => {
  const now = Date.now();
  return (
    locationCache.data !== null
    && now - locationCache.timestamp < LOCATION_CONFIG.CACHE_TTL_MS
  );
};

/**
 * Detects the client IANA timezone using `Intl`.
 * Falls back to Bogotá's timezone if unavailable.
 */
const getTimeZone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.trim()) return tz;
  }
  catch {
    // Fallback silently
  }
  return BOGOTA_LOCATION.timeZone;
};

/**
 * Attempts to read browser geolocation coordinates with a timeout.
 * Returns `null` when unavailable, denied, or timed out.
 */
const getGeolocation = (): Promise<GeolocationCoordinates | null> => {
  if (typeof navigator === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      resolve(null);
    }, LOCATION_CONFIG.DEFAULT_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timeoutId);
        resolve(position.coords);
      },
      () => {
        window.clearTimeout(timeoutId);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: LOCATION_CONFIG.DEFAULT_TIMEOUT_MS,
        maximumAge: 300_000,
      }
    );
  });
};

/**
 * Converts a numeric coordinate to a string, falling back when invalid.
 */
const formatCoordinate = (
  value: number | undefined,
  fallback: string
): string => {
  return Number.isFinite(value) ? String(value) : fallback;
};

/**
 * Returns the best-effort client location:
 * - Uses an in-memory cache (TTL) to avoid repeated lookups.
 * - Uses browser geolocation for `lat`/`lon` when available (fallback to Bogotá).
 * - Uses the Location API for `city`/`country` and optional `timeZone` enrichment.
 * - Always returns a fully populated `TClientLocation` with Bogotá defaults.
 */
export const getClientLocation = async (): Promise<TClientLocation> => {
  // Return cached result if valid
  if (isCacheValid() && locationCache.data !== null) {
    return locationCache.data;
  }

  const timeZone = getTimeZone();

  if (typeof navigator === "undefined") {
    const fallback = { ...BOGOTA_LOCATION, timeZone };
    locationCache = { data: fallback, timestamp: Date.now() };
    return fallback;
  }

  const coords = await getGeolocation();

  if (!coords) {
    const fallback = { ...BOGOTA_LOCATION, timeZone };
    locationCache = { data: fallback, timestamp: Date.now() };
    return fallback;
  }

  const lat = formatCoordinate(coords.latitude, BOGOTA_LOCATION.lat);
  const lon = formatCoordinate(coords.longitude, BOGOTA_LOCATION.lon);

  try {
    // TODO: this should not use a service
    const apiResult = await fetchLocationData();

    const result: TClientLocation = {
      lat,
      lon,
      timeZone: apiResult.timeZone,
      city: apiResult.city,
      country: apiResult.country,
    };

    locationCache = { data: result, timestamp: Date.now() };
    return result;
  }
  catch (error) {
    console.warn("Location API failed, using coordinates fallback:", error);

    const fallback: TClientLocation = {
      lat,
      lon,
      timeZone,
      city: BOGOTA_LOCATION.city,
      country: BOGOTA_LOCATION.country,
    };

    locationCache = { data: fallback, timestamp: Date.now() };

    return fallback;
  }
};

/**
 * Clears the in-memory location cache so the next `getClientLocation()` call refetches.
 */
export const invalidateLocationCache = (): void => {
  locationCache = { data: null, timestamp: 0 };
};
