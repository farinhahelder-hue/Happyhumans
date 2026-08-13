// Bilingual FR/EN foundation. French is the default (unprefixed URLs);
// English lives under /en. See docs/PLAN_FR_EN.md.

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

const SITE_URL = 'https://happyhumans.vercel.app';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// "/coaching" + "en" -> "/en/coaching" ; "/" + "en" -> "/en"
export function localizedHref(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

// "/en/coaching" -> "en"
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1] ?? '';
  return isLocale(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}

// "/en/coaching" -> "/coaching" ; "/en" -> "/"
export function stripLocale(pathname: string): string {
  const seg = pathname.split('/')[1] ?? '';
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = pathname.slice(seg.length + 1);
    return rest === '' ? '/' : rest;
  }
  return pathname;
}

// Next Metadata `alternates` (canonical + hreflang) for a page's French path.
export function hreflangAlternates(frPath: string, locale: Locale) {
  const enPath = localizedHref(frPath, 'en');
  return {
    canonical: `${SITE_URL}${locale === DEFAULT_LOCALE ? frPath : enPath}`,
    languages: {
      fr: `${SITE_URL}${frPath}`,
      en: `${SITE_URL}${enPath}`,
      'x-default': `${SITE_URL}${frPath}`,
    },
  };
}
