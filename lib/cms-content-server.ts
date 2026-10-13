import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

/**
 * Lecture côté serveur des textes d'une page du CMS (table site_content), pour les pages rendues sur le serveur
 * (ex. page d'un article). Les composants « client » utilisent le hook useCmsContent à la place.
 *
 * Renvoie les valeurs par défaut, remplacées par les textes PUBLIÉS dans le CMS (jamais les brouillons « draft:… »).
 * Si Supabase est indisponible, on retombe sur les valeurs par défaut : la page ne casse jamais.
 */
export const getPageContent = cache(
  async (page: string, defaults: Record<string, string>): Promise<Record<string, string>> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return { ...defaults }
    try {
      const sb = createClient(url, key)
      const { data, error } = await sb.from('site_content').select('block_key, value').eq('page', page)
      if (error || !data) return { ...defaults }
      const merged: Record<string, string> = { ...defaults }
      for (const row of data as { block_key: string; value: string | null }[]) {
        const v = (row.value ?? '').trim()
        if (v) merged[row.block_key] = row.value as string // un champ vidé dans le CMS revient à sa valeur par défaut
      }
      return merged
    } catch {
      return { ...defaults }
    }
  },
)
