import { describe, it, expect } from 'vitest'
import { PAGE_SECTIONS, parseLayout, fullOrder, resolveSections, serializeLayout, moveSection, toggleSection, type SectionDef } from '@/lib/cms-sections'

const defs: SectionDef[] = [
  { id: 'hero', label: 'Hero', pin: 'start' },
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
  { id: 'cta', label: 'CTA', pin: 'end' },
]

describe('resolveSections', () => {
  it('valeur vide = ordre d’origine', () => {
    expect(resolveSections(defs, '')).toEqual(['hero', 'a', 'b', 'c', 'cta'])
    expect(resolveSections(defs, undefined)).toEqual(['hero', 'a', 'b', 'c', 'cta'])
  })
  it('applique un ordre personnalisé', () => {
    expect(resolveSections(defs, JSON.stringify({ order: ['c', 'a', 'b'], hidden: [] }))).toEqual(['hero', 'c', 'a', 'b', 'cta'])
  })
  it('masque des sections', () => {
    expect(resolveSections(defs, JSON.stringify({ order: [], hidden: ['b'] }))).toEqual(['hero', 'a', 'c', 'cta'])
  })
  it('les sections verrouillées restent à leur place et ne peuvent pas être masquées', () => {
    const json = JSON.stringify({ order: ['cta', 'c', 'hero', 'a'], hidden: ['hero', 'cta', 'b'] })
    expect(resolveSections(defs, json)).toEqual(['hero', 'c', 'a', 'cta'])
  })
  it('ignore un id inconnu et ajoute en fin de milieu une section absente de l’ordre enregistré', () => {
    expect(resolveSections(defs, JSON.stringify({ order: ['zzz', 'c'], hidden: ['yyy'] }))).toEqual(['hero', 'c', 'a', 'b', 'cta'])
  })
  it('un doublon dans l’ordre n’affiche la section qu’une fois', () => {
    expect(resolveSections(defs, JSON.stringify({ order: ['b', 'b', 'a'], hidden: [] }))).toEqual(['hero', 'b', 'a', 'c', 'cta'])
  })
  it('un JSON invalide ou mal typé ne casse jamais la page', () => {
    for (const bad of ['{', 'null', '[]', '"texte"', '{"order":"a"}', '{"order":[1,2],"hidden":{}}']) {
      expect(resolveSections(defs, bad)).toEqual(['hero', 'a', 'b', 'c', 'cta'])
    }
  })
})

describe('serializeLayout', () => {
  it('renvoie une chaîne vide quand la disposition est celle d’origine', () => {
    expect(serializeLayout(defs, { order: ['hero', 'a', 'b', 'c', 'cta'], hidden: [] })).toBe('')
    expect(serializeLayout(defs, { order: [], hidden: [] })).toBe('')
  })
  it('enregistre un ordre ou un masquage personnalisé, et le relit à l’identique', () => {
    const json = serializeLayout(defs, { order: ['c', 'a', 'b'], hidden: ['b'] })
    expect(json).not.toBe('')
    expect(resolveSections(defs, json)).toEqual(['hero', 'c', 'a', 'cta'])
  })
  it('n’enregistre jamais de masquage sur une section verrouillée', () => {
    expect(parseLayout(serializeLayout(defs, { order: ['b', 'a', 'c'], hidden: ['cta', 'hero'] })).hidden).toEqual([])
  })
})

describe('moveSection / toggleSection', () => {
  it('descend et monte une section', () => {
    expect(fullOrder(defs, moveSection(defs, { order: [], hidden: [] }, 'a', 1))).toEqual(['hero', 'b', 'a', 'c', 'cta'])
    expect(fullOrder(defs, moveSection(defs, { order: [], hidden: [] }, 'c', -1))).toEqual(['hero', 'a', 'c', 'b', 'cta'])
  })
  it('ne dépasse pas les sections verrouillées', () => {
    expect(fullOrder(defs, moveSection(defs, { order: [], hidden: [] }, 'a', -1))).toEqual(['hero', 'a', 'b', 'c', 'cta'])
    expect(fullOrder(defs, moveSection(defs, { order: [], hidden: [] }, 'c', 1))).toEqual(['hero', 'a', 'b', 'c', 'cta'])
  })
  it('une section verrouillée ne bouge pas', () => {
    expect(fullOrder(defs, moveSection(defs, { order: [], hidden: [] }, 'hero', 1))).toEqual(['hero', 'a', 'b', 'c', 'cta'])
  })
  it('masque puis réaffiche', () => {
    const hidden = toggleSection(defs, { order: [], hidden: [] }, 'b')
    expect(hidden.hidden).toEqual(['b'])
    expect(toggleSection(defs, hidden, 'b').hidden).toEqual([])
    expect(toggleSection(defs, { order: [], hidden: [] }, 'hero').hidden).toEqual([])
  })
})

describe('registre PAGE_SECTIONS', () => {
  it.each(Object.entries(PAGE_SECTIONS))('« %s » : ids uniques et au plus un verrou de début', (_page, list) => {
    expect(new Set(list.map(d => d.id)).size).toBe(list.length)
    expect(list.filter(d => d.pin === 'start').length).toBeLessThanOrEqual(1)
    if (list.some(d => d.pin === 'start')) expect(list[0].pin).toBe('start')
    if (list.some(d => d.pin === 'end')) expect(list[list.length - 1].pin).toBe('end')
  })
})
