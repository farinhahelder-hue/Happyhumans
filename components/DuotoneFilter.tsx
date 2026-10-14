/**
 * Filtre « duotone » de la marque : les ombres de la photo deviennent vert foncé (#1e3a34) et les hautes lumières or
 * (#c9a96e). Défini une seule fois dans la page ; la classe .hh-duotone (globals.css) l'applique à une image.
 */
export default function DuotoneFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <filter id="hh-duotone" colorInterpolationFilters="sRGB">
        {/* niveaux de gris */}
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
        {/* noir → vert #1e3a34, blanc → or #c9a96e */}
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.118 0.788" />
          <feFuncG type="table" tableValues="0.227 0.663" />
          <feFuncB type="table" tableValues="0.204 0.431" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
