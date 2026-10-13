import { describe, it, expect } from 'vitest'
import { draftPage, isDraftPage, basePage, overlayDrafts, changedKeys, planDraftSave } from '@/lib/cms-drafts'

describe('noms de page des brouillons', () => {
  it('préfixe, détecte et retire « draft: »', () => {
    expect(draftPage('coaching')).toBe('draft:coaching')
    expect(isDraftPage('draft:coaching')).toBe(true)
    expect(isDraftPage('coaching')).toBe(false)
    expect(basePage('draft:coaching')).toBe('coaching')
    expect(basePage('coaching')).toBe('coaching')
  })
})

describe('overlayDrafts', () => {
  const pub = [{ block_key: 'a', value: 'A' }, { block_key: 'b', value: 'B' }]
  it('le brouillon remplace le publié et ajoute les nouvelles clés', () => {
    const out = overlayDrafts(pub, [{ block_key: 'b', value: 'B2' }, { block_key: 'c', value: 'C' }])
    expect(Object.fromEntries(out.map(r => [r.block_key, r.value]))).toEqual({ a: 'A', b: 'B2', c: 'C' })
  })
  it('un brouillon vide est conservé (il vide le champ)', () => {
    const out = overlayDrafts(pub, [{ block_key: 'a', value: '' }])
    expect(out.find(r => r.block_key === 'a')?.value).toBe('')
  })
  it('sans brouillon : identique au publié', () => {
    expect(overlayDrafts(pub, [])).toEqual(pub)
  })
})

describe('changedKeys', () => {
  it('ne signale que les champs différents de la référence', () => {
    expect(changedKeys(['a', 'b', 'c'], { a: 'x', b: 'B', c: '' }, { a: 'A', b: 'B', c: undefined })).toEqual(['a'])
  })
})

describe('planDraftSave', () => {
  const keys = ['title', 'text', 'badge']
  const baseline = { title: 'T', text: 'X', badge: 'B' }

  it('rien à faire si rien n’a changé : on n’écrit jamais les défauts', () => {
    expect(planDraftSave(keys, { ...baseline }, baseline, {})).toEqual({ save: [], reset: [] })
  })
  it('écrit uniquement les champs modifiés', () => {
    expect(planDraftSave(keys, { ...baseline, title: 'T2' }, baseline, {})).toEqual({ save: [{ key: 'title', value: 'T2' }], reset: [] })
  })
  it('ne réécrit pas un champ déjà enregistré en brouillon avec la même valeur', () => {
    expect(planDraftSave(keys, { ...baseline, title: 'T2' }, baseline, { title: 'T2' })).toEqual({ save: [], reset: [] })
  })
  it('réécrit si le brouillon existant a encore changé', () => {
    expect(planDraftSave(keys, { ...baseline, title: 'T3' }, baseline, { title: 'T2' })).toEqual({ save: [{ key: 'title', value: 'T3' }], reset: [] })
  })
  it('retire le brouillon d’un champ revenu à sa valeur publiée', () => {
    expect(planDraftSave(keys, { ...baseline }, baseline, { title: 'T2' })).toEqual({ save: [], reset: ['title'] })
  })
  it('vider un champ publié = un brouillon vide', () => {
    expect(planDraftSave(keys, { ...baseline, badge: '' }, baseline, {})).toEqual({ save: [{ key: 'badge', value: '' }], reset: [] })
  })
  it('un champ absent de la saisie est traité comme vide', () => {
    expect(planDraftSave(['x'], {}, { x: 'valeur' }, {})).toEqual({ save: [{ key: 'x', value: '' }], reset: [] })
  })
})
