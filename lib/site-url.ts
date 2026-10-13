/**
 * URL publique du site : base des URL canoniques, du sitemap, de robots.txt et des liens dans les e-mails.
 *
 * Adresse officielle : https://happyhumans.vercel.app (valeur par défaut ci-dessous).
 * Si un nom de domaine personnalisé est branché un jour, il suffit de renseigner la variable d'environnement
 * NEXT_PUBLIC_SITE_URL (sans slash final) : tout le site suit (canonicals, sitemap, robots, articles, e-mails).
 */
export const DEFAULT_SITE_URL = 'https://happyhumans.vercel.app'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')
