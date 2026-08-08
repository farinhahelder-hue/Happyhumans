"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Sets <html lang> to the active locale. The shared marketing layout renders
 * lang="fr" server-side; on /en pages this corrects it client-side for
 * assistive tech and rendered-DOM SEO. hreflang tags (per-page metadata) carry
 * the primary signal for search engines.
 */
export default function SetHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "fr";
    };
  }, [locale]);
  return null;
}
