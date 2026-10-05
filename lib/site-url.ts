/**
 * URL publique du site : base des URL canoniques, du sitemap, de robots.txt et des liens dans les e-mails.
 *
 * Définie par la variable d'environnement NEXT_PUBLIC_SITE_URL (ex. https://happyhumans.fr, sans slash final).
 * Sans elle, on garde l'adresse actuelle : rien ne change tant que la variable n'est pas renseignée.
 */
export const DEFAULT_SITE_URL = 'https://happyhumans.vercel.app'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')

/** true si l'URL du site a été choisie explicitement via NEXT_PUBLIC_SITE_URL */
export const SITE_URL_IS_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim())
