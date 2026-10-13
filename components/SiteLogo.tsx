'use client'
import { useState } from 'react'
import LogoSVG from '@/components/LogoSVG'

export type LogoShape = 'circle' | 'rounded' | 'square'

/** Hauteur maximale du logo dans l'en-tête fixe (au-delà, il recouvrirait le haut des pages). */
export const HEADER_LOGO_MAX = 64

/** Taille saisie dans le CMS → nombre utilisable (valeur par défaut si vide ou invalide, bornée à `max`). */
export function logoPx(raw: string | undefined, fallback: number, max = HEADER_LOGO_MAX): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(Math.max(Math.round(n), 16), max)
}

export function logoShape(raw: string | undefined): LogoShape {
  return raw === 'rounded' || raw === 'square' ? raw : 'circle'
}

/** Logo de la charte graphique (« HAPPY HUMANS »), affiché tant qu'aucun logo n'est envoyé dans le CMS. */
export const DEFAULT_LOGO = '/logo-happy-humans.png'
/** Même logo en crème, pour le pied de page (fond vert foncé). */
export const DEFAULT_LOGO_LIGHT = '/logo-happy-humans-clair.png'

/**
 * Logo à afficher d'après les réglages du CMS : le logo envoyé par Monica (avec ses réglages de forme, de taille
 * et d'affichage du nom), sinon le logo de la charte, toujours sans découpe et sans le nom (il le contient déjà).
 */
export function resolveLogo(
  s: Record<string, string | undefined>,
  opts: { sizeKey?: string; fallbackSize?: number; maxSize?: number; onDark?: boolean } = {},
): { url: string; shape: LogoShape; size: number; showName: boolean; isDefault: boolean } {
  const custom = s.logo_url || ''
  const size = logoPx(s[opts.sizeKey ?? 'logo_size'], opts.fallbackSize ?? 52, opts.maxSize)
  if (custom) return { url: custom, shape: logoShape(s.logo_shape), size, showName: s.logo_show_name !== 'false', isDefault: false }
  return { url: opts.onDark ? DEFAULT_LOGO_LIGHT : DEFAULT_LOGO, shape: 'square', size, showName: false, isDefault: true }
}

const RADIUS: Record<LogoShape, string> = { circle: '50%', rounded: '12px', square: '0' }

/**
 * Logo du site : l'image téléversée dans le CMS (Paramètres → Logo & Identité), sinon le logo d'origine.
 * Formes « cercle » et « arrondi » : l'image est découpée au carré. « Sans découpe » : l'image garde ses
 * proportions (utile pour un logo large).
 */
export default function SiteLogo({
  url,
  size = 44,
  shape = 'circle',
  alt = '',
  className = '',
}: {
  url?: string
  size?: number
  shape?: LogoShape
  alt?: string
  className?: string
}) {
  // adresse dont le chargement a échoué : on revient alors au logo d'origine (sans effet, sans état à réinitialiser)
  const [failedUrl, setFailedUrl] = useState<string | undefined>()

  if (!url || failedUrl === url) return <LogoSVG size={size} className={className} />

  const style: React.CSSProperties =
    shape === 'square'
      ? { height: size, width: 'auto', maxWidth: size * 4, objectFit: 'contain' }
      : { height: size, width: size, borderRadius: RADIUS[shape], objectFit: 'cover' }

  return (
    <img src={url} alt={alt} style={style} className={className} onError={() => setFailedUrl(url)} />
  )
}
