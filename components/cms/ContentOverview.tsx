'use client'

import { useMemo, useState } from 'react'
import {
  cardMatches,
  contentStats,
  isListField,
  pageStats,
  searchContent,
  valueSnippet,
  planReplacements,
  replacementStats,
  type ContentField,
  type ContentFilter,
  type ReplacementPlanItem,
} from '@/lib/cms-search'

/**
 * Onglet « 🔎 Contenu » : une carte de TOUS les textes du site.
 * - chercher un texte, un libellé ou une page (sans se soucier des accents) ;
 * - voir ce qui a été personnalisé et ce qui attend d'être publié ;
 * - ouvrir directement le bon champ dans l'onglet Pages, ou rétablir le texte d'origine.
 * Toute la logique de lecture/recherche vit dans `lib/cms-search.ts` (testée).
 */
type Props = {
  fields: ContentField[]
  onOpen: (field: ContentField) => void
  onOpenPage: (page: string) => void
  onPublish: (page: string) => void
  onReset: (field: ContentField) => void
  /** Enregistre les remplacements en brouillon (l'admin écrit en base) */
  onReplace: (plan: ReplacementPlanItem[]) => void
  busy?: boolean
}

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,.06)',
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '.45rem .9rem',
  borderRadius: '999px',
  border: `1.5px solid ${active ? '#2d5f54' : '#e0dbd5'}`,
  background: active ? '#2d5f54' : 'white',
  color: active ? 'white' : '#57534e',
  fontSize: '.82rem',
  fontWeight: 600,
  cursor: 'pointer',
})

const pill: React.CSSProperties = {
  fontSize: '.7rem',
  fontWeight: 700,
  color: '#c2410c',
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '999px',
  padding: '.05rem .5rem',
  whiteSpace: 'nowrap',
}

export default function ContentOverview({ fields, onOpen, onOpenPage, onPublish, onReset, onReplace, busy }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ContentFilter>('all')
  const [replaceMode, setReplaceMode] = useState(false)
  const [replaceWith, setReplaceWith] = useState('')

  const stats = useMemo(() => contentStats(fields), [fields])
  const pages = useMemo(() => pageStats(fields), [fields])
  const results = useMemo(() => searchContent(fields, query, filter), [fields, query, filter])
  const searching = query.trim() !== '' || filter !== 'all'
  const plan = useMemo(
    () => (replaceMode ? planReplacements(fields, query, replaceWith) : []),
    [replaceMode, fields, query, replaceWith],
  )
  const replaceSummary = useMemo(() => replacementStats(plan), [plan])

  /** Ce qu'un résultat affiche sous son titre : un extrait, ou la carte qui correspond. */
  const renderValue = (field: ContentField) => {
    const body: React.CSSProperties = { margin: 0, fontSize: '.85rem', color: '#57534e', lineHeight: 1.5, overflowWrap: 'anywhere' }
    if (isListField(field)) {
      const matches = cardMatches(field, query, 2)
      const total = field.listItems?.length ?? 0
      if (matches.length > 0) {
        return matches.map(match => (
          <p key={`${match.index}-${match.fieldLabel}`} style={body}>
            <span style={{ color: '#a8a29e', fontSize: '.78rem', fontWeight: 600 }}>
              📋 {match.name} · {match.fieldLabel}
            </span>
            <br />
            {match.snippet}
          </p>
        ))
      }
      return (
        <p style={{ ...body, color: '#a8a29e' }}>
          {total > 0 ? `${total} carte${total > 1 ? 's' : ''} — « Ouvrir » les affiche toutes.` : '(liste vide)'}
        </p>
      )
    }
    return <p style={body}>{field.effectiveValue.trim() ? valueSnippet(field.effectiveValue, query) : '(texte vide)'}</p>
  }

  const tiles = [
    { label: 'Textes éditables', value: stats.fields, color: '#2d5f54' },
    { label: 'Personnalisés', value: stats.customized, color: '#c2410c' },
    { label: 'En attente de publication', value: stats.pending, color: stats.pending > 0 ? '#b45309' : '#2d5f54' },
    { label: 'Pages avec brouillon', value: stats.pagesWithPending, color: stats.pagesWithPending > 0 ? '#b45309' : '#2d5f54' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a34', margin: 0, fontFamily: 'Georgia, serif' }}>
          🔎 Contenu du site
        </h1>
        <p style={{ color: '#888', fontSize: '.9rem', margin: '.35rem 0 0', lineHeight: 1.55 }}>
          Tous les textes des pages, au même endroit. Cherchez une phrase pour savoir où elle se modifie,
          voyez ce que vous avez personnalisé, et ce qui attend d’être publié.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {tiles.map(tile => (
          <div key={tile.label} style={{ ...card, padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '.72rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 .4rem' }}>
              {tile.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: tile.color, margin: 0 }}>{tile.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: '1.5rem' }}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔍 Chercher un texte, un titre, une page… (ex : tarif, équipe, témoignage)"
          aria-label="Rechercher dans tous les textes du site"
          style={{ width: '100%', padding: '.8rem 1rem', border: '1.5px solid #e0dbd5', borderRadius: '.6rem', fontSize: '.95rem', marginBottom: '1rem' }}
        />
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={() => setFilter('all')} style={chipStyle(filter === 'all')}>Tout</button>
          <button type="button" onClick={() => setFilter('custom')} style={chipStyle(filter === 'custom')}>● Personnalisés</button>
          <button type="button" onClick={() => setFilter('pending')} style={chipStyle(filter === 'pending')}>📝 En attente de publication</button>
          <span style={{ marginLeft: 'auto', fontSize: '.8rem', color: '#a8a29e' }}>
            {results.length} résultat{results.length > 1 ? 's' : ''} sur {stats.fields}
          </span>
        </div>

        {/* Remplacer un mot partout : les changements partent en brouillon. */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece7' }}>
          {!replaceMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setReplaceMode(true)}
                disabled={!query.trim()}
                title={query.trim() ? 'Remplacer ce mot dans tous les textes des pages' : 'Cherchez d’abord le mot à remplacer'}
                style={{ padding: '.45rem .9rem', background: 'white', color: query.trim() ? '#01696f' : '#a8a29e', border: '1.5px solid', borderColor: query.trim() ? '#b8ddd6' : '#e7e5e4', borderRadius: '.5rem', cursor: query.trim() ? 'pointer' : 'default', fontSize: '.82rem', fontWeight: 600 }}
              >
                🔁 Remplacer ce mot dans plusieurs textes
              </button>
              {!query.trim() && <span style={{ fontSize: '.8rem', color: '#a8a29e' }}>Cherchez d’abord le mot à remplacer.</span>}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.85rem', color: '#57534e' }}>
                  Remplacer «&nbsp;{query.trim()}&nbsp;» par
                </span>
                <input
                  value={replaceWith}
                  onChange={e => setReplaceWith(e.target.value)}
                  placeholder="Nouveau texte"
                  aria-label="Texte de remplacement"
                  style={{ flex: 1, minWidth: 220, padding: '.55rem .8rem', border: '1.5px solid #e0dbd5', borderRadius: '.5rem', fontSize: '.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => { setReplaceMode(false); setReplaceWith('' ) }}
                  style={{ padding: '.45rem .8rem', background: 'none', border: 'none', color: '#78716c', cursor: 'pointer', fontSize: '.82rem', fontWeight: 600 }}
                >
                  ✕ Fermer
                </button>
              </div>
              <p style={{ fontSize: '.8rem', color: '#a8a29e', margin: '.55rem 0 0', lineHeight: 1.55 }}>
                Les changements sont enregistrés en <strong>brouillon</strong> : rien n’est en ligne avant « Publier ».
                Les cartes (programmes, témoignages, FAQ…) sont incluses, texte par texte ; les images, les liens
                et les choix fermés (mise en avant, icône) ne sont jamais touchés.
              </p>
              {query.trim() && (
                <div style={{ marginTop: '.75rem' }}>
                  <p style={{ fontSize: '.85rem', fontWeight: 700, color: plan.length ? '#2d5f54' : '#a8a29e', margin: 0 }}>
                    {plan.length
                      ? `${replaceSummary.fields} texte${replaceSummary.fields > 1 ? 's' : ''} sur ${replaceSummary.pages} page${replaceSummary.pages > 1 ? 's' : ''} · ${replaceSummary.occurrences} occurrence${replaceSummary.occurrences > 1 ? 's' : ''}`
                      : 'Aucune occurrence à remplacer.'}
                  </p>
                  {plan.length > 0 && (
                    <>
                      <ul style={{ listStyle: 'none', margin: '.6rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        {plan.slice(0, 12).map(item => {
                          // Une liste est réécrite d'un bloc, mais on montre chaque texte de carte modifié.
                          const previews = item.cards ?? [
                            { index: 0, name: '', fieldLabel: '', before: item.before, after: item.after, count: item.count },
                          ]
                          return (
                            <li key={`${item.field.page}-${item.field.key}`} style={{ background: '#fdfcfa', border: '1px solid #f0ece7', borderRadius: '.5rem', padding: '.55rem .8rem' }}>
                              <p style={{ margin: 0, fontSize: '.78rem', color: '#a8a29e', fontWeight: 600 }}>
                                {item.field.emoji} {item.field.pageLabel} · {item.field.group} — {item.field.shortLabel}
                                {item.cards && ` · ${item.cards.length} texte${item.cards.length > 1 ? 's' : ''}`}
                              </p>
                              {previews.slice(0, 4).map((change, ci) => (
                                <div key={`${change.index}-${change.fieldLabel}-${ci}`} style={{ marginTop: ci === 0 ? '.2rem' : '.4rem' }}>
                                  {(change.name || change.fieldLabel) && (
                                    <p style={{ margin: 0, fontSize: '.72rem', color: '#b8b0a6', fontWeight: 600 }}>
                                      {[change.name, change.fieldLabel].filter(Boolean).join(' · ')}
                                    </p>
                                  )}
                                  <p style={{ margin: 0, fontSize: '.8rem', color: '#a8a29e', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
                                    <span style={{ textDecoration: 'line-through' }}>{valueSnippet(change.before, query, 20, 50)}</span>
                                  </p>
                                  <p style={{ margin: 0, fontSize: '.8rem', color: '#166534', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
                                    {valueSnippet(change.after, replaceWith, 20, 50)}
                                  </p>
                                </div>
                              ))}
                              {previews.length > 4 && (
                                <p style={{ margin: '.3rem 0 0', fontSize: '.75rem', color: '#a8a29e' }}>
                                  … et {previews.length - 4} autre{previews.length - 4 > 1 ? 's' : ''} texte{previews.length - 4 > 1 ? 's' : ''} dans cette liste.
                                </p>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                      {plan.length > 12 && (
                        <p style={{ fontSize: '.78rem', color: '#a8a29e', margin: '.4rem 0 0' }}>
                          … et {plan.length - 12} autre{plan.length - 12 > 1 ? 's' : ''} texte{plan.length - 12 > 1 ? 's' : ''}.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => onReplace(plan)}
                        disabled={busy}
                        style={{ marginTop: '.7rem', padding: '.5rem 1rem', background: '#c2410c', color: 'white', border: 'none', borderRadius: '.5rem', cursor: busy ? 'default' : 'pointer', fontSize: '.85rem', fontWeight: 700, opacity: busy ? .6 : 1 }}
                      >
                        {busy ? '⏳ Enregistrement…' : `Remplacer dans ${replaceSummary.fields} texte${replaceSummary.fields > 1 ? 's' : ''} (brouillon)`}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {replaceMode ? null : searching ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {results.length === 0 && (
            <div style={{ ...card, textAlign: 'center', color: '#a8a29e', fontSize: '.9rem', padding: '2.5rem' }}>
              Aucun texte ne correspond. Essayez un mot plus court, ou retirez le filtre.
            </div>
          )}
          {results.map(field => (
            <div
              key={`${field.page}-${field.key}`}
              style={{ ...card, padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpen(field)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(field) } }}
                title="Ouvrir ce champ dans l’onglet Pages"
                style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '.2rem' }}>
                  <span style={{ fontSize: '.78rem', color: '#a8a29e', fontWeight: 600 }}>
                    {field.emoji} {field.pageLabel} · {field.group}
                  </span>
                  {field.isCustom && <span style={pill}>● personnalisé</span>}
                  {field.isPending && <span style={pill}>📝 pas encore en ligne</span>}
                </div>
                <p style={{ margin: '0 0 .2rem', fontSize: '.92rem', fontWeight: 700, color: '#292524' }}>{field.shortLabel}</p>
                {renderValue(field)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => onOpen(field)}
                  style={{ padding: '.4rem .9rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.45rem', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700 }}
                >
                  Ouvrir
                </button>
                {field.isCustom && (
                  <button
                    type="button"
                    onClick={() => onReset(field)}
                    title="Supprimer votre version et revenir au texte d’origine"
                    style={{ padding: '.4rem .9rem', background: 'white', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '.45rem', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}
                  >
                    ↺ Original
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={card}>
          <p style={{ fontSize: '.72rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 1rem' }}>
            Page par page
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pages.map(row => (
              <div
                key={row.page}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.6rem 0', borderBottom: '1px solid #f5f3ef', flexWrap: 'wrap' }}
              >
                <span style={{ fontSize: '.92rem', fontWeight: 600, color: '#292524', minWidth: 190 }}>
                  {row.emoji} {row.pageLabel}
                </span>
                <span style={{ fontSize: '.8rem', color: row.customized > 0 ? '#c2410c' : '#a8a29e', minWidth: 150 }}>
                  {row.customized > 0 ? `${row.customized} texte${row.customized > 1 ? 's' : ''} personnalisé${row.customized > 1 ? 's' : ''}` : 'tout d’origine'}
                  <span style={{ color: '#c7c2bb' }}> · {row.total}</span>
                </span>
                <span style={{ fontSize: '.78rem', color: row.pending > 0 ? '#9a3412' : '#16a34a', fontWeight: 600, minWidth: 130 }}>
                  {row.pending > 0 ? `📝 ${row.pending} en attente` : '✓ à jour'}
                </span>
                <div style={{ display: 'flex', gap: '.4rem', marginLeft: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => onOpenPage(row.page)}
                    style={{ padding: '.35rem .8rem', background: 'white', color: '#2d5f54', border: '1.5px solid #2d5f54', borderRadius: '.45rem', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}
                  >
                    Ouvrir
                  </button>
                  {row.pending > 0 && (
                    <button
                      type="button"
                      onClick={() => onPublish(row.page)}
                      disabled={busy}
                      style={{ padding: '.35rem .8rem', background: '#c2410c', color: 'white', border: 'none', borderRadius: '.45rem', cursor: busy ? 'default' : 'pointer', fontSize: '.78rem', fontWeight: 700, opacity: busy ? .6 : 1 }}
                    >
                      🚀 Publier
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pages.length === 0 && (
              <p style={{ fontSize: '.9rem', color: '#a8a29e', textAlign: 'center', padding: '2rem 0', margin: 0 }}>
                Aucune page éditable trouvée.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
