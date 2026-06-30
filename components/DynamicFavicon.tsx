'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SVG_FAVICON = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%232d5f54"/>
      <stop offset="100%" stop-color="%233d7a72"/>
    </linearGradient>
  </defs>
  <circle cx="22" cy="22" r="20" fill="url(%23g)"/>
  <g stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="11" y="13" width="22" height="20" rx="3"/>
    <line x1="11" y1="19" x2="33" y2="19"/>
    <line x1="16" y1="9" x2="16" y2="15"/>
    <line x1="28" y1="9" x2="28" y2="15"/>
    <path d="M17 26L20 29L27 22" stroke-width="2"/>
  </g>
</svg>
`)}`;

export default function DynamicFavicon() {
  useEffect(() => {
    // Set SVG favicon immediately (no flicker)
    const existingFavicon = document.querySelector("link[rel='icon']:not([href*='.png']):not([href*='.ico'])");
    if (!existingFavicon || existingFavicon.getAttribute('href')?.startsWith('data:')) {
      // Already set, no change needed
    }

    // Also check Supabase for custom favicon_url
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const sb = createClient(url, key);
    sb.from('cms_settings_kv')
      .select('key, value')
      .in('key', ['favicon_url'])
      .then(({ data }) => {
        const favicon = data?.find((r: any) => r.key === 'favicon_url')?.value;
        if (!favicon) return;
        document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favicon;
        document.head.appendChild(link);
      });
  }, []);
  return null;
}
