'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readCookieConsent, writeCookieConsent } from '@/lib/consent';
import { useCmsContent } from '@/hooks/useCmsContent';
import { SITE_DEFAULTS } from '@/lib/cms-defaults/site';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  // Textes modifiables dans le CMS (page « Textes communs »)
  const c = useCmsContent('site', SITE_DEFAULTS);

  // Lecture du cookie reportée après hydratation pour éviter tout mismatch serveur/client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation : lecture cookie côté client uniquement
    setVisible(readCookieConsent() === null);
  }, []);

  const setConsent = (value: 'accepted' | 'rejected') => {
    writeCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-2xl border border-stone-200 bg-white shadow-2xl">
        <div className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-eucalyptus font-semibold mb-2">
            {c.cookie_title}
          </p>
          <p className="text-sm md:text-base text-charcoal/85 leading-relaxed">
            {c.cookie_text}
          </p>
          <p className="text-sm mt-3 text-charcoal/75">
            {c.cookie_details}{' '}
            <Link
              href="/politique-confidentialite"
              className="text-eucalyptus hover:text-teal transition font-medium"
            >
              {c.cookie_privacy_link}
            </Link>{' '}
            {c.cookie_and}{' '}
            <Link
              href="/mentions-legales"
              className="text-eucalyptus hover:text-teal transition font-medium"
            >
              {c.cookie_legal_link}
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setConsent('rejected')}
              className="px-5 py-2.5 rounded-lg border border-stone-300 text-charcoal hover:border-stone-400 transition"
            >
              {c.cookie_refuse}
            </button>
            <button
              type="button"
              onClick={() => setConsent('accepted')}
              className="px-5 py-2.5 rounded-lg bg-eucalyptus text-white font-medium hover:bg-eucalyptus/90 transition"
            >
              {c.cookie_accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
