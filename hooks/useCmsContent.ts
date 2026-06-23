'use client';
import { useState, useEffect } from 'react';

type CmsContent = Record<string, string>;
const cache: Record<string, { data: CmsContent; ts: number }> = {};
const TTL = 30_000;

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsContent {
  const [content, setContent] = useState<CmsContent>(defaults);

  useEffect(() => {
    const now = Date.now();
    const cached = cache[page];
    if (cached && now - cached.ts < TTL) {
      setContent({ ...defaults, ...cached.data });
      return;
    }

    // Lecture via API serveur (pas de NEXT_PUBLIC vars requises)
    fetch(`/api/cms/public-content?page=${encodeURIComponent(page)}`)
      .then(r => r.ok ? r.json() : { content: [] })
      .then(({ content: rows }) => {
        if (!rows?.length) return;
        const map: CmsContent = {};
        rows.forEach((r: { block_key: string; value: string }) => {
          if (r.value) map[r.block_key] = r.value;
        });
        cache[page] = { data: map, ts: Date.now() };
        setContent({ ...defaults, ...map });
      })
      .catch(() => {/* garde les defaults si erreur réseau */});
  }, [page]);

  return content;
}
