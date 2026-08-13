'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n';

/** Sets <html lang> on the client for /en pages (root layout renders lang="fr"). */
export default function SetHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = 'fr';
    };
  }, [locale]);
  return null;
}
