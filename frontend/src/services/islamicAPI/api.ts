import { ISLAMIC_API_URL } from "astro:env/client";
import { getSecret } from "astro:env/server";

export type TIslamicApiQueryValue
  = | string
    | number
    | boolean
    | null
    | undefined;
export type TIslamicApiQueryParams = Record<string, TIslamicApiQueryValue>;

/**
 * Generic HTTP client for IslamicAPI endpoints.
 *
 * - Builds a URL from `ISLAMIC_API_URL` + `target`
 * - Serializes `params` into query string (skips `null`/`undefined`)
 * - Injects `api_key` when `ISLAMIC_API_KEY` is available (server-only secret)
 * - Throws on non-2xx responses and returns the JSON body typed as `TResult`
 */
export const fetchIslamicData = async <
  TResult,
  TParams extends TIslamicApiQueryParams = TIslamicApiQueryParams
>(
  target: string,
  params: TParams = {} as TParams,
  init?: RequestInit
): Promise<TResult> => {
  const baseUrl = ISLAMIC_API_URL;
  const apiKey = getSecret("ISLAMIC_API_KEY");

  const url = new URL(target, baseUrl);
  const searchParams = new URLSearchParams(url.search);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(key, String(value));
  }

  if (typeof apiKey === "string" && apiKey.trim()) {
    searchParams.set("api_key", apiKey);
  }

  url.search = searchParams.toString();

  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`Islamic API request failed (${String(res.status)})`);
  }

  return (await res.json()) as unknown as TResult;
};
