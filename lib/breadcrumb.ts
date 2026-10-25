/**
 * Fil d'Ariane : logique pure (aucune dépendance React/Next), testée dans
 * __tests__/lib/breadcrumb.test.ts et utilisée par components/Breadcrumb.tsx.
 *
 * Les libellés viennent du CMS (page « fil-ariane ») ; l'adresse de chaque
 * maillon est déduite du chemin : rien à saisir côté technique.
 */

export type Crumb = { label: string; href: string }

/**
 * « nos-ateliers » → « Nos ateliers » (maillon sans libellé CMS : article, page libre…).
 * Seule la première lettre est mise en capitale : c'est l'usage français, et cela
 * reproduit le titre d'une page créée dans le CMS (« Nos ateliers 2026 »).
 */
export function prettifySegment(segment: string): string {
  const words = segment.split('-').filter(Boolean).join(' ')
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : ''
}

/**
 * Adresses techniques dont le nom de dossier ne dit rien à un visiteur.
 * Le libellé du CMS (page « fil-ariane ») reste prioritaire s'il existe.
 */
export const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Espace client',
  '/auth/login': 'Connexion',
  '/auth/register': 'Créer un compte',
}

/** Préfixes d'adresse purement techniques, sans maillon propre dans le fil. */
const TECHNICAL_SEGMENTS = new Set(['p', 'auth'])

/** Chemin sans paramètres ni ancre. */
function cleanPath(pathname: string | null | undefined): string {
  return (pathname || '/').split('?')[0].split('#')[0] || '/'
}

/**
 * Le fil est masqué sur l'accueil (il n'y aurait qu'un seul maillon) et quand
 * Monica l'a désactivé dans le CMS (valeur « 0 », « non », « false » ou « off »).
 * Une valeur vide garde le fil affiché.
 */
export function isBreadcrumbHidden(enabled: string | null | undefined, pathname: string | null | undefined): boolean {
  const value = (enabled ?? '').trim().toLowerCase()
  if (['0', 'non', 'false', 'off'].includes(value)) return true
  return cleanPath(pathname) === '/'
}

/**
 * Construit les maillons : Accueil, puis un maillon par segment d'adresse.
 * Un libellé du CMS remplace le texte déduit ; l'adresse reste celle du chemin.
 */
export function buildCrumbs(
  pathname: string | null | undefined,
  homeLabel: string | null | undefined,
  labels: Record<string, string | undefined> = {},
): Crumb[] {
  const segments = cleanPath(pathname).split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ label: (homeLabel ?? '').trim() || 'Accueil', href: '/' }]
  let href = ''
  for (const segment of segments) {
    href += `/${segment}`
    // Les pages créées dans le CMS vivent sous /p/<adresse> : « p » n'est qu'un préfixe
    // technique, il n'a pas sa place dans le fil (« Accueil › Ateliers »). Idem « auth ».
    if (TECHNICAL_SEGMENTS.has(segment) && segments.length > 1) continue
    const custom = (labels[href] ?? '').trim()
    crumbs.push({ label: custom || ROUTE_LABELS[href] || prettifySegment(segment), href })
  }
  return crumbs
}
