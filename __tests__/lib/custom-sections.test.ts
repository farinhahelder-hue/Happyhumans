import { describe, it, expect } from 'vitest'
import {
  blankBlock, customSectionDefs, customSectionId, isCustomSectionId, makeId, moveBlock, parseBlocks, removeBlock,
  serializeBlocks, splitForCustom, updateBlock,
} from '@/lib/custom-sections'

describe('custom-sections', () => {
  it('parseBlocks tolère tout (vide, invalide, non-tableau)', () => {
    expect(parseBlocks('')).toEqual([])
    expect(parseBlocks(null)).toEqual([])
    expect(parseBlocks('{mauvais json')).toEqual([])
    expect(parseBlocks('{"a":1}')).toEqual([])
    expect(parseBlocks('[{"id":"x"}]')).toEqual([]) // sans type valide
  })

  it('parseBlocks garde les blocs valides', () => {
    const blocks = parseBlocks(JSON.stringify([{ id: 'a', type: 'texte', text: 'hello', align: 'left' }]))
    expect(blocks).toHaveLength(1)
    expect(blocks[0]).toMatchObject({ id: 'a', type: 'texte' })
  })

  it('serializeBlocks : vide → chaîne vide (retombe sur défauts)', () => {
    expect(serializeBlocks([])).toBe('')
    expect(parseBlocks(serializeBlocks([blankBlock('cta', 'x')]))).toHaveLength(1)
  })

  it('blankBlock fournit les défauts par gabarit', () => {
    expect(blankBlock('split', 's')).toMatchObject({ type: 'split', layout: 'image-right' })
    expect(blankBlock('cta', 'c')).toMatchObject({ href: '/contact' })
    expect(makeId()).toMatch(/^b[0-9a-z]+$/)
  })

  it('moveBlock déplace sans sortir des bornes', () => {
    const bs = [blankBlock('texte', 'a'), blankBlock('texte', 'b'), blankBlock('texte', 'c')]
    expect(moveBlock(bs, 'b', -1).map(b => b.id)).toEqual(['b', 'a', 'c'])
    expect(moveBlock(bs, 'a', -1).map(b => b.id)).toEqual(['a', 'b', 'c'])
    expect(moveBlock(bs, 'c', 1).map(b => b.id)).toEqual(['a', 'b', 'c'])
    expect(moveBlock(bs, 'zzz', 1)).toHaveLength(3)
  })

  it('removeBlock / updateBlock', () => {
    const bs = [blankBlock('texte', 'a'), blankBlock('image', 'b')]
    expect(removeBlock(bs, 'a').map(b => b.id)).toEqual(['b'])
    const up = updateBlock(bs, 'a', { text: 'nouveau' } as never)
    expect((up[0] as { text: string }).text).toBe('nouveau')
    expect((up[1] as { type: string }).type).toBe('image')
  })

  it('splitForCustom isole l’appel à l’action final', () => {
    expect(splitForCustom(['cta'], ['hero', 'x', 'cta'])).toEqual({ main: ['hero', 'x'], end: ['cta'] })
    expect(splitForCustom([], ['a', 'b'])).toEqual({ main: ['a', 'b'], end: [] })
  })

  it('customSectionDefs expose les blocs comme sections déplaçables', () => {
    const bs = [blankBlock('cta', 'x'), blankBlock('texte', 'y')]
    const defs = customSectionDefs(bs)
    expect(defs.map(d => d.id)).toEqual(['custom:x', 'custom:y'])
    expect(customSectionId('x')).toBe('custom:x')
    expect(isCustomSectionId('custom:x')).toBe(true)
    expect(isCustomSectionId('hero')).toBe(false)
    expect(defs[0].label).toContain('🧩')
  })
})
