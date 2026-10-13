import { describe, it, expect } from 'vitest'
import { DEFAULT_NAV } from '@/hooks/useCmsNavigation'
import {
  addNavItem, addSubItem, cloneNav, moveItem, moveSubItem,
  removeNavItem, removeSubItem, renumber, updateNavItem, updateSubItem,
} from '@/lib/cms-nav'

const labels = (items: { label: string }[]) => items.map(i => i.label)

describe('menu du site — opérations de l’éditeur', () => {
  it('le menu d’origine est complet et ses positions se suivent', () => {
    expect(labels(DEFAULT_NAV)).toEqual(['Monica', 'Coaching', 'Organisations', 'Happiness Design', 'Relations', 'Contact', 'Réserver une séance'])
    expect(DEFAULT_NAV.map(i => i.position)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('moveItem : glisser vers le bas place l’élément AVANT la cible (comme le trait vert de l’éditeur)', () => {
    const next = moveItem(cloneNav(DEFAULT_NAV), 0, 3) // Monica glissé sur « Happiness Design »
    expect(labels(next)).toEqual(['Coaching', 'Organisations', 'Monica', 'Happiness Design', 'Relations', 'Contact', 'Réserver une séance'])
    expect(next.map(i => i.position)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('moveItem : glisser vers le haut, et dépôt en fin de liste', () => {
    expect(labels(moveItem(cloneNav(DEFAULT_NAV), 4, 0))[0]).toBe('Relations')
    const end = moveItem(cloneNav(DEFAULT_NAV), 0, DEFAULT_NAV.length)
    expect(labels(end).at(-1)).toBe('Monica')
    expect(end.map(i => i.position)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('moveItem : déplacements sans effet', () => {
    const base = cloneNav(DEFAULT_NAV)
    expect(moveItem(base, 2, 2)).toBe(base)
    expect(moveItem(base, -1, 2)).toBe(base)
    expect(moveItem(base, 2, 99)).toBe(base)
  })

  it('renommer « Organisations » en « Entreprises » sans toucher aux autres liens', () => {
    const next = updateNavItem(cloneNav(DEFAULT_NAV), '3', { label: 'Entreprises' })
    expect(next.find(i => i.id === '3')?.label).toBe('Entreprises')
    expect(next.find(i => i.id === '3')?.href).toBe('/entreprises')
    expect(labels(next).filter(l => l === 'Entreprises')).toHaveLength(1)
  })

  it('sous-menu : réordonner, renommer, ajouter, supprimer', () => {
    let nav = cloneNav(DEFAULT_NAV)
    nav = moveSubItem(nav, '2', 2, 0)
    expect(labels(nav[1].dropdownItems!)).toEqual(['Sparring Partner', 'Coaching individuel', 'Témoignages'])
    expect(nav[1].dropdownItems!.map(s => s.position)).toEqual([1, 2, 3])
    nav = updateSubItem(nav, '2', '2c', { label: 'Sparring' })
    expect(nav[1].dropdownItems![0].label).toBe('Sparring')
    nav = addSubItem(nav, '2')
    expect(nav[1].dropdownItems).toHaveLength(4)
    nav = removeSubItem(nav, '2', '2b')
    expect(labels(nav[1].dropdownItems!)).toEqual(['Sparring', 'Coaching individuel', 'Nouveau lien'])
  })

  it('ajouter et supprimer un lien du menu', () => {
    let nav = addNavItem(cloneNav(DEFAULT_NAV))
    expect(nav).toHaveLength(8)
    expect(nav.at(-1)).toMatchObject({ label: 'Nouveau lien', visible: true, position: 8 })
    const addedId = nav.at(-1)!.id
    nav = removeNavItem(nav, addedId)
    expect(nav).toHaveLength(7)
    expect(nav.map(i => i.position)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('les identifiants des liens ajoutés sont uniques', () => {
    const ids = new Set(addNavItem(addNavItem(addNavItem([]))).map(i => i.id))
    expect(ids.size).toBe(3)
  })

  it('cloneNav : modifier la copie ne change pas le menu d’origine', () => {
    const copy = cloneNav(DEFAULT_NAV)
    copy[1].dropdownItems![0].label = 'X'
    copy[0].label = 'Y'
    expect(DEFAULT_NAV[1].dropdownItems![0].label).toBe('Coaching individuel')
    expect(DEFAULT_NAV[0].label).toBe('Monica')
  })

  it('renumber ne modifie pas la liste d’origine', () => {
    const src = [{ position: 9 }, { position: 4 }]
    expect(renumber(src)).toEqual([{ position: 1 }, { position: 2 }])
    expect(src[0].position).toBe(9)
  })
})
