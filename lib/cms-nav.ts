import type { NavItem } from '@/hooks/useCmsNavigation'

/**
 * Opérations pures sur le menu du site (déplacer, renommer, ajouter, supprimer) — utilisées par l'éditeur de menu
 * (admin et mode édition du site) et testées dans __tests__/lib/cms-nav.test.ts.
 */

/** Renumérote les positions (1, 2, 3…) dans l'ordre actuel de la liste. */
export function renumber<T extends { position: number }>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, position: i + 1 }))
}

/** Déplace l'élément `from` à la place `to` (glisser-déposer). */
export function moveItem<T extends { position: number }>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to > items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to > from ? to - 1 : to, 0, moved)
  return renumber(next)
}

/** Déplace un sous-élément d'un menu déroulant. */
export function moveSubItem(items: NavItem[], parentId: string, from: number, to: number): NavItem[] {
  return items.map(item =>
    item.id === parentId ? { ...item, dropdownItems: moveItem(item.dropdownItems ?? [], from, to) } : item,
  )
}

export function updateNavItem(items: NavItem[], id: string, updates: Partial<NavItem>): NavItem[] {
  return items.map(item => (item.id === id ? { ...item, ...updates } : item))
}

export function updateSubItem(items: NavItem[], parentId: string, subId: string, updates: Partial<NavItem>): NavItem[] {
  return items.map(item =>
    item.id === parentId
      ? { ...item, dropdownItems: (item.dropdownItems ?? []).map(sub => (sub.id === subId ? { ...sub, ...updates } : sub)) }
      : item,
  )
}

let counter = 0
const newId = () => `n${Date.now().toString(36)}${(counter++).toString(36)}`

/** Ajoute un lien en fin de menu. */
export function addNavItem(items: NavItem[]): NavItem[] {
  return renumber([...items, { id: newId(), label: 'Nouveau lien', href: '/', visible: true, position: items.length + 1 }])
}

/** Ajoute un lien dans un menu déroulant. */
export function addSubItem(items: NavItem[], parentId: string): NavItem[] {
  return items.map(item =>
    item.id === parentId
      ? {
          ...item,
          dropdownItems: renumber([
            ...(item.dropdownItems ?? []),
            { id: newId(), label: 'Nouveau lien', href: '/', visible: true, position: (item.dropdownItems?.length ?? 0) + 1 },
          ]),
        }
      : item,
  )
}

export function removeNavItem(items: NavItem[], id: string): NavItem[] {
  return renumber(items.filter(item => item.id !== id))
}

export function removeSubItem(items: NavItem[], parentId: string, subId: string): NavItem[] {
  return items.map(item =>
    item.id === parentId ? { ...item, dropdownItems: renumber((item.dropdownItems ?? []).filter(sub => sub.id !== subId)) } : item,
  )
}

/** Copie profonde (le menu d'origine ne doit jamais être modifié par l'éditeur). */
export function cloneNav(items: NavItem[]): NavItem[] {
  return items.map(item => ({ ...item, dropdownItems: item.dropdownItems ? item.dropdownItems.map(sub => ({ ...sub })) : undefined }))
}
