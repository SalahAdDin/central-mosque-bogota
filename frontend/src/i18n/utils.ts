import { interpolate } from "@utils/string.utils";

import { ui, defaultLang, routes, type TLang } from "./ui";

/**
 * Extracts the language code from an Astro route URL.
 *
 * Expects the first path segment to be a locale code (e.g. `/es/...`, `/en/...`).
 * Falls back to `defaultLang` when the segment is missing or not a supported locale.
 */
export function getLangFromUrl(url: URL): TLang {
  const [, lang] = url.pathname.split("/");

  if (lang in ui) return lang as TLang;

  return defaultLang;
}

/**
 * Builds a translation function bound to a specific locale.
 *
 * The returned function:
 * - Looks up `key` in the selected locale dictionary and falls back to `defaultLang`.
 * - Supports simple `{{ placeholder }}` interpolation in the translation string.
 *
 * Interpolation usage:
 * - `t(key, value)` maps to `{ location: value }` for convenience.
 * - `t(key, { name: "Ali" })` replaces `{{ name }}` with `"Ali"`.
 */
export function useTranslations(lang: TLang) {
  type TKey = keyof (typeof ui)[typeof defaultLang];
  type TVars = Record<string, string | number>;

  /**
   * Translates a dictionary key, optionally interpolating variables into the message.
   *
   * Placeholders use the `{{ varName }}` format.
   */
  function t(key: TKey): string;
  function t(key: TKey, value: string | number): string;
  function t(key: TKey, vars: TVars): string;
  function t(key: TKey, varsOrValue?: TVars | string | number): string {
    const dict = ui[lang] as Partial<Record<TKey, string>>;
    const fallbackDict = ui[defaultLang] as Record<TKey, string>;
    const raw = dict[key] ?? fallbackDict[key];

    if (typeof varsOrValue === "string" || typeof varsOrValue === "number") {
      return interpolate(raw, { location: varsOrValue });
    }

    return interpolate(raw, varsOrValue);
  }

  return t;
}

/**
 * Attempts to resolve the canonical route key from a localized URL.
 *
 * Example:
 * - `/en/prayer-information` -> `prayer-information`
 * - `/es/informacion-oraciones` -> `prayer-information`
 *
 * @param url - The URL to inspect.
 * @returns The canonical route key if it can be determined; otherwise `undefined`.
 */
export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname.split("/");
  const path = parts.pop() ?? parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    return routes[defaultLang][path];
  }

  /**
   * Finds the first key in an object whose value matches `value`.
   *
   * @param obj - Dictionary to search.
   * @param value - Value to reverse lookup.
   * @returns The matching key if found; otherwise `undefined`.
   */
  const getKeyByValue = (
    obj: Record<string, string | undefined>,
    value: string
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}

/**
 * Builds a helper that translates a canonical route key into a localized URL path.
 *
 * The returned function:
 * - Strips `/` from the input (so `"prayer-information"` and `"/prayer-information"` both work).
 * - Resolves the localized slug for the target locale.
 * - Always prefixes the output with the locale code (even for `defaultLang`).
 *
 * @param lang - Locale used as the default when `l` is not provided.
 * @returns A `translatePath` function returning locale-prefixed paths.
 */
export function useTranslatedPath(lang: TLang) {
  return function translatePath(path: string, l: TLang = lang): string {
    const pathName = path.replaceAll("/", "");
    const slug = routes[l][pathName];
    const translatedPath = slug ? `/${slug}` : path;

    // return l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
    return `/${l}${translatedPath}`;
  };
}

/**
 * Type guard for supported locale codes.
 *
 * @param value - Candidate locale string (e.g. from a URL segment).
 * @returns `true` when the value is a supported locale key in `ui`.
 */
export function isSupportedLang(value: string | undefined): value is TLang {
  if (!value) return false;

  return value in ui;
}
