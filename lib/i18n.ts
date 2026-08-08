// Site locales. French is the default and lives at the root (/coaching);
// other locales are prefixed (/en/coaching).
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Prefixes an internal path for a locale. French (default) stays unprefixed;
// e.g. localizedHref("/coaching", "en") === "/en/coaching".
export function localizedHref(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

// Reads the active locale from a pathname ("/en/coaching" -> "en").
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}

// Removes the locale prefix ("/en/coaching" -> "/coaching", "/en" -> "/").
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1] ?? "";
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

const SITE_URL = "https://happyhumans.fr";

// Builds Next Metadata `alternates` (canonical + hreflang languages) for a page
// given its French path, so search engines index FR and EN separately.
export function hreflangAlternates(
  frPath: string,
  locale: Locale
): { canonical: string; languages: Record<string, string> } {
  const enPath = localizedHref(frPath, "en");
  return {
    canonical: `${SITE_URL}${locale === DEFAULT_LOCALE ? frPath : enPath}`,
    languages: {
      fr: `${SITE_URL}${frPath}`,
      en: `${SITE_URL}${enPath}`,
      "x-default": `${SITE_URL}${frPath}`,
    },
  };
}
