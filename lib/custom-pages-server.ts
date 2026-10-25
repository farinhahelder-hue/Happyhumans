import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CUSTOM_PAGES_KEY, CUSTOM_PAGES_PAGE, findPublishedPage, parsePages, type CustomPage } from './custom-pages'

/**
 * Lecture côté serveur des pages libres créées dans le CMS, pour l'adresse publique /p/<slug>.
 *
 * Une seule ligne de `site_content` contient toutes les pages (page « custom-pages », bloc « pages »).
 * Si Supabase est indisponible ou si le JSON est illisible, on renvoie [] : le site ne casse jamais
 * (l'adresse répond alors 404).
 */
export const getCustomPages = cache(async (): Promise<CustomPage[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  try {
    const sb = createClient(url, key)
    const { data, error } = await sb
      .from('site_content')
      .select('block_key, value')
      .eq('page', CUSTOM_PAGES_PAGE)
    if (error || !data) return []
    const row = (data as { block_key: string; value: string | null }[]).find(r => r.block_key === CUSTOM_PAGES_KEY)
    return parsePages(row?.value)
  } catch {
    return []
  }
})

/** Page en ligne correspondant à l'adresse (undefined si absente ou hors ligne). */
export async function getPublishedCustomPage(slug: string): Promise<CustomPage | undefined> {
  return findPublishedPage(await getCustomPages(), slug)
}
