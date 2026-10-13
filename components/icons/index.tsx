import type { ReactNode, SVGProps } from 'react'

/**
 * Petit jeu d'icônes linéaires (trait de 1,5, sans remplissage) pour remplacer les emojis du site.
 * Elles héritent de la couleur du texte (currentColor) : la couleur se règle avec une classe ou un style
 * sur l'icône ou sur son conteneur. Aucune dépendance ; composant serveur ou client.
 *
 *   <Icon name="heart" className="h-7 w-7 text-[#2d5f54]" />
 */
const PATHS = {
  book: (
    <>
      <path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  mirror: (
    <>
      <ellipse cx="12" cy="9.5" rx="5.5" ry="7" />
      <path d="M12 16.5V21M9 21h6" />
      <path d="M9.5 7.5c.5-1 1.3-1.7 2.3-2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" />
      <path d="M5 19l8-8" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3-2-5-6-5 0 3 2 5 6 5z" />
      <path d="M12 14c0-3 2-5 6-5 0 3-2 5-6 5z" />
    </>
  ),
  wave: (
    <>
      <path d="M3 9c2-2 3.5-2 5.5 0s3.5 2 5.5 0 3.5-2 5.5 0" />
      <path d="M3 15c2-2 3.5-2 5.5 0s3.5 2 5.5 0 3.5-2 5.5 0" />
    </>
  ),
  wind: (
    <>
      <path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 13h14a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 17h6" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  connect: (
    <>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M3 13h18" />
    </>
  ),
  knot: <path d="M7 8a4 4 0 1 0 0 8c4 0 6-8 10-8a4 4 0 1 1 0 8c-4 0-6-8-10-8z" />,
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2" />
      <path d="M9 3h6" />
    </>
  ),
  note: (
    <>
      <path d="M5 4h10l4 4v12H5z" />
      <path d="M8 12h8M8 16h5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V4h6v1" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18h.01" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  wrench: <path d="M14 7a4 4 0 0 1 5.5-3.7l-2.5 2.5.5 2 2 .5 2.5-2.5A4 4 0 0 1 16.3 12L7.5 20.8a2 2 0 0 1-2.8-2.8z" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName
  /** Côté en pixels (par défaut 24) ; une classe Tailwind h-* w-* peut aussi servir. */
  size?: number | string
  /** Épaisseur du trait (1,5 par défaut, comme les icônes de l'accueil). */
  strokeWidth?: number
}

export function Icon({ name, size = 24, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}

export const ICON_NAMES = Object.keys(PATHS) as IconName[]
