import { createClient } from '@supabase/supabase-js';

// Lecture server-side des réglages clé/valeur du CMS (cms_settings_kv).
// Retourne un objet vide en cas d'indisponibilité (Supabase en pause, etc.)
// pour que sitemap/robots/metadata retombent sur leurs valeurs par défaut.
export async function getKvSettings(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return {};
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from('cms_settings_kv').select('key, value');
    if (error || !data) return {};
    const map: Record<string, string> = {};
    data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value ?? ''; });
    return map;
  } catch {
    return {};
  }
}

// Une page est indexable sauf si le CMS dit explicitement 'false'
export function isPageIndexable(kv: Record<string, string>, page: string): boolean {
  return kv[`page_${page}_indexable`] !== 'false';
}
