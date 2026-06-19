'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type CmsContent = Record<string, string>;
const cache: Record<string, CmsContent> = {};

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsContent {
  const [content, setContent] = useState<CmsContent>(defaults);

  useEffect(() => {
    if (cache[page]) { setContent({ ...defaults, ...cache[page] }); return; }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    createClient(url, key)
      .from('site_content')
      .select('block_key, value')
      .eq('page', page)
      .then(({ data }) => {
        if (!data) return;
        const map: CmsContent = {};
        data.forEach((r: { block_key: string; value: string }) => { map[r.block_key] = r.value; });
        cache[page] = map;
        setContent({ ...defaults, ...map });
      });
  }, [page]);

  return content;
}
