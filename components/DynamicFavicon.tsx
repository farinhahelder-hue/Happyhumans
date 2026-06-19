'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function DynamicFavicon() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const sb = createClient(url, key);
    sb.from('cms_settings')
      .select('key, value')
      .in('key', ['favicon_url'])
      .then(({ data }) => {
        const favicon = data?.find((r: any) => r.key === 'favicon_url')?.value;
        if (!favicon) return;
        // Remove existing favicons
        document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
        // Add new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favicon;
        document.head.appendChild(link);
      });
  }, []);
  return null;
}
