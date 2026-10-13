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
