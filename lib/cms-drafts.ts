/**
 * Brouillon / publication du contenu des pages.
 *
 * Aucune migration SQL : un brouillon est une ligne de `site_content` dont la colonne `page`
 * vaut « draft:<page> ». Le site public interroge `page = '<page>'` et ne voit donc jamais
 * les brouillons. « Publier » recopie les lignes `draft:<page>` vers `<page>` puis les supprime.
 *
 * Ce fichier est volontairement SANS dépendance (ni React, ni Next, ni Supabase) :
 * il est partagé par l'admin, les routes API et le hook, et testé seul.
 */

export const DRAFT_PREFIX = 'draft:'

export const draftPage = (page: string) => DRAFT_PREFIX + page
export const isDraftPage = (page: string) => page.startsWith(DRAFT_PREFIX)
export const basePage = (page: string) => (isDraftPage(page) ? page.slice(DRAFT_PREFIX.length) : page)

export type ContentRow = { block_key: string; value: string | null }

/** Le brouillon l'emporte sur le publié, champ par champ. Un brouillon vide est conservé (il « vide » le champ). */
export function overlayDrafts<T extends ContentRow>(published: T[], drafts: T[]): T[] {
  const byKey = new Map<string, T>()
  for (const r of published) byKey.set(r.block_key, r)
  for (const d of drafts) byKey.set(d.block_key, d)
  return [...byKey.values()]
}

/**
 * Clés dont la valeur saisie diffère de la référence.
 * `baseline` = valeur publiée (ou valeur par défaut si rien n'est publié).
 */
export function changedKeys(keys: string[], edited: Record<string, string | undefined>, baseline: Record<string, string | undefined>): string[] {
  return keys.filter(k => (edited[k] ?? '') !== (baseline[k] ?? ''))
}

export type DraftPlan = {
  /** à écrire dans le brouillon */
  save: { key: string; value: string }[]
  /** à retirer du brouillon : le champ est revenu à sa valeur publiée */
  reset: string[]
}

/**
 * Décide quoi faire pour « Enregistrer le brouillon » :
 *  - champ modifié par rapport à la dernière version enregistrée (brouillon, sinon publié) → écrire
 *  - champ revenu à la valeur publiée alors qu'un brouillon existait → supprimer le brouillon
 *  - champ inchangé → ne rien faire (on n'écrit JAMAIS les valeurs par défaut en base)
 */
export function planDraftSave(
  keys: string[],
  edited: Record<string, string | undefined>,
  baseline: Record<string, string | undefined>,
  savedDrafts: Record<string, string | undefined>,
): DraftPlan {
  const plan: DraftPlan = { save: [], reset: [] }
  for (const k of keys) {
    const now = edited[k] ?? ''
    const base = baseline[k] ?? ''
    const hasDraft = k in savedDrafts
    const lastSaved = hasDraft ? (savedDrafts[k] ?? '') : base
    if (now === lastSaved) continue
    if (now === base) { if (hasDraft) plan.reset.push(k) } else plan.save.push({ key: k, value: now })
  }
  return plan
}
