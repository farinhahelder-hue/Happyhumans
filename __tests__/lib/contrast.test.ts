import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DuotoneFilter from '@/components/DuotoneFilter'

const root = path.resolve(__dirname, '../..')
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n')

const channel = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const luminance = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}
/** Rapport de contraste WCAG entre deux couleurs hexadécimales. */
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const CREAM = '#f5f0e8'
const WHITE = '#ffffff'
const FOOTER_GREEN = '#1e3a34'
const AA = 4.5

describe('contraste des textes (WCAG AA : 4,5:1)', () => {
  it('le calcul de contraste est exact (noir sur blanc = 21:1)', () => {
    expect(contrast('#000000', WHITE)).toBeCloseTo(21, 0)
  })

  it('texte secondaire (--hh-text-muted) lisible sur crème et sur blanc', () => {
    const muted = read('app/globals.css').match(/--hh-text-muted:\s*(#[0-9a-fA-F]{6})/)![1]
    expect(contrast(muted, CREAM)).toBeGreaterThanOrEqual(AA)
    expect(contrast(muted, WHITE)).toBeGreaterThanOrEqual(AA)
    expect(read('tailwind.config.ts')).toContain(`'hh-text-muted': '${muted}'`)
  })

  it('l’ancien gris-vert #5a7a74 (4,1:1 sur crème, 2,6:1 sur le pied de page) n’est plus utilisé', () => {
    expect(contrast('#5a7a74', CREAM)).toBeLessThan(AA)
    expect(contrast('#5a7a74', FOOTER_GREEN)).toBeLessThan(AA)
    for (const f of ['components/Footer.tsx', 'app/mentions-legales/MentionsLegalesContent.tsx', 'app/politique-confidentialite/PolitiqueContent.tsx', 'app/globals.css', 'tailwind.config.ts']) {
      expect(read(f), f).not.toMatch(/#5a7a74/i)
    }
  })

  it('tous les textes du pied de page sont lisibles sur son fond vert foncé', () => {
    const colors = [...read('components/Footer.tsx').matchAll(/(?<![A-Za-z])color:\s*'(#[0-9a-fA-F]{6})'/g)].map(m => m[1])
    expect(colors.length).toBeGreaterThan(3)
    for (const c of new Set(colors)) expect(contrast(c, FOOTER_GREEN), `${c} sur ${FOOTER_GREEN}`).toBeGreaterThanOrEqual(AA)
  })
})

describe('effet duotone vert/or', () => {
  it('le filtre part du vert #1e3a34 (ombres) et arrive à l’or #c9a96e (lumières)', () => {
    const html = renderToStaticMarkup(createElement(DuotoneFilter))
    expect(html).toContain('id="hh-duotone"')
    const table = (fn: string) => html.match(new RegExp(`<${fn}[^>]*tableValues="([^"]+)"`))![1].split(' ').map(Number)
    const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => v / 255) }
    const green = rgb('#1e3a34'), gold = rgb('#c9a96e')
    ;(['feFuncR', 'feFuncG', 'feFuncB'] as const).forEach((fn, i) => {
      const [dark, light] = table(fn)
      expect(dark).toBeCloseTo(green[i], 2)
      expect(light).toBeCloseTo(gold[i], 2)
    })
  })

  it('la classe .hh-duotone applique le filtre', () => {
    expect(read('app/globals.css')).toMatch(/\.hh-duotone\s*\{\s*filter:\s*url\(#hh-duotone\);\s*\}/)
  })

  it('le filtre est présent dans toutes les pages (layout) et désactivable par un réglage du CMS', () => {
    expect(read('app/layout.tsx')).toContain('<DuotoneFilter />')
    expect(read('app/api/cms/settings/route.ts')).toContain("key: 'photo_duotone'")
    expect(read('app/api/cms/public-settings/route.ts')).toContain("'photo_duotone'")
    expect(read('components/EditableImage.tsx')).toContain("photo_duotone !== 'false'")
  })
})
