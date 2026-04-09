import { defaultLang, routes, ui, type TLang } from "@i18n/ui";
import type { MiddlewareHandler } from "astro";

const isSupportedLang = (value: string | undefined): value is TLang => {
  if (!value) return false;
  return value in ui;
};

const reverseRouteLookup = (lang: TLang, slug: string): string | undefined => {
  const entry = Object.entries(routes[lang]).find(([, value]) => value === slug);
  return entry?.[0];
};

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  const langFromPath = parts[0];
  const lang = isSupportedLang(langFromPath) ? langFromPath : defaultLang;
  const rest = isSupportedLang(langFromPath) ? parts.slice(1) : parts;

  if (rest.length !== 1) {
    return next();
  }

  const slug = rest[0];
  const canonicalKey
    = reverseRouteLookup(lang, slug) ?? (slug in routes[lang] ? slug : undefined);

  if (!canonicalKey) {
    return next();
  }

  const canonicalPath = `/${lang}/${canonicalKey}`;

  if (canonicalPath === url.pathname) {
    return next();
  }

  const rewriteUrl = new URL(`${canonicalPath}${url.search}`, url);
  return next(rewriteUrl);
};
