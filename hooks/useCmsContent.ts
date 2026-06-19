'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type CmsContent = Record<string, string>;

let cache: Record<string, CmsContent> = {};

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsContent {
  const [content, setContent] = useState<CmsContent>(defaults);

  useEffect(() => {
    if (cache[page]) {
      setContent({ ...defaults, ...cache[page] });
      return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const sb = createClient(url, key);
    sb.from('cms_site_content')
      .select('section_key, content')
      .eq('page_slug', page)
      .then(({ data }) => {
        if (!data) return;
        const map: CmsContent = {};
        data.forEach((r: { section_key: string; content: string }) => {
          map[r.section_key] = r.content;
        });
        cache[page] = map;
        setContent({ ...defaults, ...map });
      });
  }, [page]);

  return content;
}
