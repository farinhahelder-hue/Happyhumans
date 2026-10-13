import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Icon, ICON_NAMES } from '@/components/icons'

describe('icônes Phosphor', () => {
  it('chaque icône du jeu s’affiche en SVG décoratif, couleur héritée du texte', () => {
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(20)
    for (const name of ICON_NAMES) {
      const html = renderToStaticMarkup(createElement(Icon, { name }))
      expect(html, name).toMatch(/^<svg\b/)
      expect(html, name).toContain('aria-hidden="true"')
      expect(html, name).toContain('fill="currentColor"')
    }
  })

  it('trait « light » par défaut, « thin » à partir de 48 px, graisse modifiable', () => {
    const light = renderToStaticMarkup(createElement(Icon, { name: 'heart', size: 24 }))
    const thin = renderToStaticMarkup(createElement(Icon, { name: 'heart', size: 56 }))
    const bold = renderToStaticMarkup(createElement(Icon, { name: 'heart', size: 24, weight: 'bold' }))
    expect(light).not.toBe(thin)
    expect(light).not.toBe(bold)
    expect(renderToStaticMarkup(createElement(Icon, { name: 'heart', size: 24, weight: 'light' }))).toBe(light)
    expect(renderToStaticMarkup(createElement(Icon, { name: 'heart', size: 56, weight: 'thin' }))).toBe(thin.replace(/(width|height)="56"/g, '$1="56"'))
  })

  it('taille et classe sont transmises', () => {
    const html = renderToStaticMarkup(createElement(Icon, { name: 'leaf', size: 34, className: 'text-[#2d5f54]' }))
    expect(html).toContain('width="34"')
    expect(html).toContain('class="text-[#2d5f54]"')
  })
})
