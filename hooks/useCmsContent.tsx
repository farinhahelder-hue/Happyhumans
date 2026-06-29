'use client';
import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const EditableField = dynamic(() => import('@/components/EditableField'), { ssr: false });

type CmsContent = Record<string, string>;

const memCache: Record<string, { data: CmsContent; ts: number }> = {};
const MEM_TTL = 5 * 60 * 1000;
const LS_TTL  = 30 * 1000;
const LS_PFX  = 'hh_cms_';

export function bustCmsCache(page: string) {
  delete memCache[page];
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(LS_PFX + page); } catch {}
  }
}

function lsGet(page: string): CmsContent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_PFX + page);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: CmsContent; ts: number };
    if (Date.now() - ts > LS_TTL) { localStorage.removeItem(LS_PFX + page); return null; }
    return data;
  } catch { return null; }
}

function lsSet(page: string, data: CmsContent) {
  try { localStorage.setItem(LS_PFX + page, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function getInitial(page: string, defaults: CmsContent): CmsContent {
  const mem = memCache[page];
  if (mem && Date.now() - mem.ts < MEM_TTL) return { ...defaults, ...mem.data };
  const ls = lsGet(page);
  if (ls) return { ...defaults, ...ls };
  return defaults;
}

type CmsResult = CmsContent & {
  /**
   * Returns an EditableField component when inline edit mode is active,
   * otherwise returns the plain text string.
   */
  get(key: string, defaultValue?: string, opts?: { multiline?: boolean; as?: string }): ReactNode;
};

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsResult {
  const [content, setContent] = useState<CmsContent>(() => getInitial(page, defaults));
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const mem = memCache[page];
    if (mem && Date.now() - mem.ts < MEM_TTL) return;

    fetch(`/api/cms/public-content?page=${encodeURIComponent(page)}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then(r => r.ok ? r.json() : { content: [] })
      .then(({ content: rows }) => {
        const map: CmsContent = {};
        (rows || []).forEach((r: { block_key: string; value: string }) => {
          if (r.value) map[r.block_key] = r.value;
        });
        memCache[page] = { data: map, ts: Date.now() };
        lsSet(page, map);
        setContent({ ...defaults, ...map });
      })
      .catch(() => {});
  }, [page]);

  const get = useCallback((key: string, defaultValue?: string, opts?: { multiline?: boolean }): ReactNode => {
    const val = content[key] ?? defaultValue ?? '';
    return (
      <EditableField
        page={page}
        fieldKey={key}
        value={val}
        multiline={opts?.multiline}
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, page]);

  // Return content spread + get method attached
  const result = content as CmsResult;
  result.get = get;
  return result;
}
