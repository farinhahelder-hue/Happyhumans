'use client'
import { useSyncExternalStore } from 'react'

/** Réglages publics du site (logo, nom, thème…) — voir /api/cms/public-settings. */
export type SiteSettings = Record<string, string>

const FRESH_MS = 30_000
const EMPTY: SiteSettings = {}
const listeners = new Set<() => void>()
let cache: { at: number; value: SiteSettings } | null = null
let inflight: Promise<void> | null = null

function refresh(): void {
  if (inflight || (cache && Date.now() - cache.at < FRESH_MS)) return
  inflight = fetch('/api/cms/public-settings')
    .then(r => (r.ok ? r.json() : { settings: {} }))
    .then(d => { cache = { at: Date.now(), value: d?.settings ?? {} } })
    .catch(() => { if (!cache) cache = { at: Date.now(), value: {} } })
    .finally(() => {
      inflight = null
      listeners.forEach(l => l())
    })
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  refresh()
  return () => { listeners.delete(onChange) }
}

/**
 * Réglages globaux partagés par l'en-tête et le pied de page : un seul appel réseau par page, réutilisé
 * quelques secondes en naviguant d'une page à l'autre (le logo ne « clignote » donc pas).
 * Côté serveur et au tout premier rendu du navigateur, la valeur est vide : les réglages arrivent juste après.
 */
export function useSiteSettings(): SiteSettings {
  return useSyncExternalStore(subscribe, () => cache?.value ?? EMPTY, () => EMPTY)
}
