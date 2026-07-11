'use client';
import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const EditableField = dynamic(() => import('@/components/EditableField'), { ssr: false });

type CmsContent = Record<string, string>;

const memCache: Record<string, { data: CmsContent; ts: number }> = {};
const MEM_TTL = 5 * 60 * 1000;
const LS_TTL  = 30 * 1000;
// Copie de secours : servie si le fetch échoue (ex: Supabase en pause),
// même au-delà du TTL de fraîcheur
const LS_STALE_TTL = 30 * 24 * 60 * 60 * 1000;
const LS_PFX  = 'hh_cms_';

export function bustCmsCache(page: string) {
  delete memCache[page];
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(LS_PFX + page); } catch {}
  }
}

function lsGet(page: string, maxAge: number = LS_TTL): CmsContent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_PFX + page);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: CmsContent; ts: number };
    if (Date.now() - ts > maxAge) return null;
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

// Retourne null si le contenu est indisponible (erreur réseau / base en pause)
// pour que l'appelant conserve son cache au lieu de l'écraser avec du vide.
async function fetchPageContent(page: string): Promise<CmsContent | null> {
  try {
    const res = await fetch(`/api/cms/public-content?page=${encodeURIComponent(page)}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    const { content: rows } = await res.json();
    const map: CmsContent = {};
    (rows || []).forEach((r: { block_key: string; value: string }) => {
      if (r.value) map[r.block_key] = r.value;
    });
    return map;
  } catch { return null; }
}

export type CmsResult = {
  content: CmsContent;
  /**
   * Returns an EditableField component when inline edit mode is active,
   * otherwise returns the plain text string.
   * Use this instead of `c.key` when you want inline editing support.
   */
  get: (key: string, defaultValue?: string, opts?: { multiline?: boolean }) => ReactNode;
} & CmsContent;

export function useCmsContent(page: string, defaults: CmsContent = {}): CmsResult {
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  const [content, setContent] = useState<CmsContent>(() => getInitial(page, defaults));
  const fetchedRef = useRef(false);

  const loadContent = useCallback(async () => {
    const map = await fetchPageContent(page);
    if (map === null) {
      // Contenu indisponible (Supabase en pause, réseau…) : servir la copie
      // de secours locale plutôt que de retomber sur les défauts
      const stale = lsGet(page, LS_STALE_TTL);
      if (stale) setContent({ ...defaultsRef.current, ...stale });
      return;
    }
    memCache[page] = { data: map, ts: Date.now() };
    lsSet(page, map);
    setContent({ ...defaultsRef.current, ...map });
  }, [page]);

  // Initial fetch
  useEffect(() => {
    if (fetchedRef.current) return;
    const mem = memCache[page];
    if (mem && Date.now() - mem.ts < MEM_TTL) return;
    fetchedRef.current = true;
    loadContent().catch(() => {});
  }, [page, loadContent]);

  // Re-fetch after a successful inline save (for the pages concerned)
  useEffect(() => {
    const onSaved = (e: Event) => {
      const detail = (e as CustomEvent<{ pages?: string[] }>).detail;
      const savedPages: string[] = detail?.pages ?? [];
      if (savedPages.includes(page) || savedPages.length === 0) {
        bustCmsCache(page);
        fetchedRef.current = false;
        loadContent().catch(() => {});
      }
    };
    window.addEventListener('inline-edit-saved', onSaved);
    return () => window.removeEventListener('inline-edit-saved', onSaved);
  }, [page, loadContent]);

  const get = useCallback((key: string, defaultValue?: string, opts?: { multiline?: boolean }): ReactNode => {
    const val = content[key] ?? defaultValue ?? defaultsRef.current[key] ?? '';
    return (
      <EditableField
        page={page}
        fieldKey={key}
        value={val}
        multiline={opts?.multiline}
      />
    );
  }, [content, page]);

  // Build the result object without mutating a potentially-frozen object
  return Object.assign(Object.create(null), content, { get, content }) as CmsResult;
}
