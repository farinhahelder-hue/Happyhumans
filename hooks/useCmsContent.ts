'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type CmsContent = Record<string, string>;
const cache: Record<string, { data: CmsContent; ts: number }> = {};
const TTL = 30_000;

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsContent {
  const [content, setContent] = useState<CmsContent>(defaults);

  useEffect(() => {
    const now = Date.now();
    const cached = cache[page];
    if (cached && now - cached.ts < TTL) {
      // defaults wins over DB for non-empty default values
      const merged: CmsContent = { ...cached.data };
      Object.keys(defaults).forEach(k => {
        if (defaults[k]) merged[k] = defaults[k];
      });
      setContent(merged);
      return;
    }
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
        data.forEach((r: { block_key: string; value: string }) => {
          if (r.value) map[r.block_key] = r.value;
        });
        cache[page] = { data: map, ts: Date.now() };
        // defaults with non-empty values always win
        const merged: CmsContent = { ...map };
        Object.keys(defaults).forEach(k => {
          if (defaults[k]) merged[k] = defaults[k];
        });
        setContent(merged);
      });
  }, [page]);

  return content;
}
