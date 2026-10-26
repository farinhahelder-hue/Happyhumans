import { describe, it, expect } from 'vitest'
import {
  buildContentIndex,
  cardMatches,
  labelParts,
  searchContent,
  contentStats,
  pageStats,
  valueSnippet,
  fieldAnchor,
  isTextualField,
  isReplaceableField,
  replaceInText,
  planReplacements,
  replacementStats,
  type ContentFieldDef,
} from '@/lib/cms-search'
import { PAGE_DEFAULTS } from '@/lib/cms-page-defaults'
import { parseItems } from '@/lib/cms-lists'

const DEFS: ContentFieldDef[] = [
  { page: 'home', pageLabel: 'Accueil', emoji: '🏠', key: 'hero_title', label: 'Hero — Titre principal', type: 'text' },
  { page: 'home', pageLabel: 'Accueil', emoji: '🏠', key: 'hero_image', label: 'Hero — Photo', type: 'image' },
  { page: 'faq', pageLabel: 'FAQ', emoji: '❓', key: 'faq_questions', label: 'Questions — Cartes', type: 'list' },
  { page: 'coaching', pageLabel: 'Coaching', emoji: '🧭', key: 'intro_title', label: 'Introduction — Titre', type: 'text' },
]

const DEFAULTS = {
  home: { hero_title: "Accompagner l'épanouissement", hero_image: '/hero.jpg' },
  faq: { faq_questions: '' },
  coaching: { intro_title: 'Un accompagnement sur mesure' },
}

describe('labelParts', () => {
  it('sépare le groupe et le libellé court', () => {
    expect(labelParts('Hero — Titre principal')).toEqual({ group: 'Hero', shortLabel: 'Titre principal' })
    expect(labelParts('Structure — Ordre et affichage des sections')).toEqual({
      group: 'Structure',
      shortLabel: 'Ordre et affichage des sections',
    })
  })

  it('range un libellé sans tiret dans « Général »', () => {
    expect(labelParts('Adresse email de contact')).toEqual({ group: 'Général', shortLabel: 'Adresse email de contact' })
  })
})

describe('buildContentIndex', () => {
  it('utilise le texte d’origine quand rien n’est enregistré', () => {
    const [title] = buildContentIndex(DEFS, [], DEFAULTS)
    expect(title.publishedValue).toBe("Accompagner l'épanouissement")
    expect(title.effectiveValue).toBe(title.publishedValue)
    expect(title.isCustom).toBe(false)
    expect(title.hasDraft).toBe(false)
    expect(title.isPending).toBe(false)
  })

  it('remplace l’original par une valeur enregistrée', () => {
    const index = buildContentIndex(DEFS, [{ page: 'home', block_key: 'hero_title', value: 'Coach & autrice' }], DEFAULTS)
    const title = index[0]
    expect(title.isCustom).toBe(true)
    expect(title.effectiveValue).toBe('Coach & autrice')
    expect(title.defaultValue).toBe("Accompagner l'épanouissement")
  })

  it('ne considère pas une valeur vidée comme personnalisée', () => {
    const [title] = buildContentIndex(DEFS, [{ page: 'home', block_key: 'hero_title', value: '   ' }], DEFAULTS)
    expect(title.isCustom).toBe(false)
    expect(title.publishedValue).toBe("Accompagner l'épanouissement")
  })

  it('superpose un brouillon, sans toucher à la valeur en ligne', () => {
    const index = buildContentIndex(
      DEFS,
      [
        { page: 'home', block_key: 'hero_title', value: 'En ligne' },
        { page: 'draft:home', block_key: 'hero_title', value: 'Brouillon' },
      ],
      DEFAULTS,
    )
    const title = index[0]
    expect(title.publishedValue).toBe('En ligne')
    expect(title.draftValue).toBe('Brouillon')
    expect(title.effectiveValue).toBe('Brouillon')
    expect(title.hasDraft).toBe(true)
    expect(title.isPending).toBe(true)
  })

  it('un brouillon identique au publié n’attend pas de publication', () => {
    const [title] = buildContentIndex(
      DEFS,
      [
        { page: 'home', block_key: 'hero_title', value: 'Pareil' },
        { page: 'draft:home', block_key: 'hero_title', value: 'Pareil' },
      ],
      DEFAULTS,
    )
    expect(title.hasDraft).toBe(true)
    expect(title.isPending).toBe(false)
  })

  it('repère un brouillon qui vide un texte en ligne', () => {
    const [title] = buildContentIndex(
      DEFS,
      [
        { page: 'home', block_key: 'hero_title', value: 'En ligne' },
        { page: 'draft:home', block_key: 'hero_title', value: '' },
      ],
      DEFAULTS,
    )
    expect(title.effectiveValue).toBe('')
    expect(title.isPending).toBe(true)
    expect(title.publishedValue).toBe('En ligne')
  })

  it('ignore les lignes des autres pages et les clés inconnues', () => {
    const index = buildContentIndex(
      DEFS,
      [
        { page: 'coaching', block_key: 'cle_supprimee', value: 'x' },
        { page: 'draft:faq', block_key: 'cle_supprimee', value: 'y' },
      ],
      DEFAULTS,
    )
    expect(index).toHaveLength(DEFS.length)
    expect(index.every(f => !f.isCustom && !f.hasDraft)).toBe(true)
  })

  it('fonctionne avec une page absente des textes d’origine', () => {
    const index = buildContentIndex(
      [...DEFS, { page: 'nouvelle', pageLabel: 'Nouvelle', emoji: '🧪', key: 'x', label: 'Divers — X', type: 'text' }],
      [{ page: 'nouvelle', block_key: 'x', value: 'Valeur' }],
      DEFAULTS,
    )
    const field = index[index.length - 1]
    expect(field.defaultValue).toBe('')
    expect(field.publishedValue).toBe('Valeur')
    expect(field.isCustom).toBe(true)
  })
})

describe('searchContent', () => {
  const index = buildContentIndex(
    DEFS,
    [
      { page: 'home', block_key: 'hero_title', value: 'Coaching pour dirigeants' },
      { page: 'draft:coaching', block_key: 'intro_title', value: 'Parlons de votre équipe' },
    ],
    DEFAULTS,
  )

  it('sans recherche ni filtre, retourne tout', () => {
    expect(searchContent(index, '  ')).toHaveLength(DEFS.length)
  })

  it('cherche dans le libellé, la page et la clé', () => {
    expect(searchContent(index, 'photo').map(f => f.key)).toEqual(['hero_image'])
    expect(searchContent(index, 'faq').every(f => f.page === 'faq')).toBe(true)
    expect(searchContent(index, 'intro_title').map(f => f.key)).toEqual(['intro_title'])
  })

  it('cherche dans la valeur affichée, sans se soucier des accents ni de la casse', () => {
    expect(searchContent(index, 'DIRIGEANTS').map(f => f.key)).toEqual(['hero_title'])
    expect(searchContent(index, 'equipe').map(f => f.key)).toEqual(['intro_title'])
  })

  it('cherche dans les cartes d’une liste, jamais dans la syntaxe JSON', () => {
    const withJson = buildContentIndex(
      DEFS,
      [{ page: 'faq', block_key: 'faq_questions', value: '[{"q":"Le yoga","a":"Une pratique du souffle"}]' }],
      DEFAULTS,
    )
    const [faq] = searchContent(withJson, 'yoga')
    expect(faq.key).toBe('faq_questions')
    expect(cardMatches(faq, 'yoga')).toEqual([
      expect.objectContaining({ index: 0, name: 'Question 1 — Le yoga', fieldLabel: 'Question' }),
    ])
    expect(cardMatches(faq, 'souffle')[0]).toMatchObject({ fieldLabel: 'Réponse', snippet: 'Une pratique du souffle' })
    // Le JSON lui-même (guillemets, accolades) n'est jamais cherché : seuls les textes des cartes le sont.
    expect(searchContent(withJson, '{"q"')).toEqual([])
    expect(searchContent(withJson, 'hero_image')).toHaveLength(1)
  })

  it('filtre les textes personnalisés et les brouillons en attente', () => {
    expect(searchContent(index, '', 'custom').map(f => f.key)).toEqual(['hero_title'])
    expect(searchContent(index, '', 'pending').map(f => f.key)).toEqual(['intro_title'])
    expect(searchContent(index, 'equipe', 'custom')).toEqual([])
  })

  it('combine recherche et filtre', () => {
    expect(searchContent(index, 'dirigeants', 'custom').map(f => f.key)).toEqual(['hero_title'])
    expect(searchContent(index, 'dirigeants', 'pending')).toEqual([])
  })
})

describe('contentStats / pageStats', () => {
  const index = buildContentIndex(
    DEFS,
    [
      { page: 'home', block_key: 'hero_title', value: 'En ligne' },
      { page: 'draft:home', block_key: 'hero_image', value: '/autre.jpg' },
      { page: 'draft:coaching', block_key: 'intro_title', value: 'Brouillon' },
    ],
    DEFAULTS,
  )

  it('compte les champs, les personnalisations et les brouillons en attente', () => {
    expect(contentStats(index)).toEqual({ fields: 4, pages: 3, customized: 1, pending: 2, pagesWithPending: 2 })
  })

  it('donne les compteurs de chaque page dans l’ordre de l’index', () => {
    const stats = pageStats(index)
    expect(stats.map(s => s.page)).toEqual(['home', 'faq', 'coaching'])
    expect(stats[0]).toMatchObject({ pageLabel: 'Accueil', emoji: '🏠', total: 2, customized: 1, pending: 1 })
    expect(stats[2]).toMatchObject({ total: 1, customized: 0, pending: 1 })
  })

  it('ne compte aucune page pour un index vide', () => {
    expect(contentStats([])).toEqual({ fields: 0, pages: 0, customized: 0, pending: 0, pagesWithPending: 0 })
    expect(pageStats([])).toEqual([])
  })
})

describe('valueSnippet', () => {
  it('retourne le texte tel quel quand il est court', () => {
    expect(valueSnippet('Bonjour', 'bonjour')).toBe('Bonjour')
  })

  it('découpe autour de la correspondance', () => {
    const long = `${'a'.repeat(120)} le mot cherché ${'b'.repeat(200)}`
    const snippet = valueSnippet(long, 'MOT CHERCHÉ', 10, 10)
    expect(snippet).toContain('mot cherché')
    expect(snippet.startsWith('…')).toBe(true)
    expect(snippet.endsWith('…')).toBe(true)
    expect(snippet.length).toBeLessThan(long.length)
  })

  it('garde le début du texte quand la correspondance est au début', () => {
    const snippet = valueSnippet('Début du texte puis la suite', 'debut', 5, 8)
    expect(snippet.startsWith('…')).toBe(false)
    expect(snippet).toContain('Début')
  })

  it('retombe sur le début du texte quand la recherche est absente', () => {
    expect(valueSnippet('x'.repeat(200), 'introuvable')).toBe(`${'x'.repeat(130)}…`)
    expect(valueSnippet('x'.repeat(200), '')).toBe(`${'x'.repeat(130)}…`)
  })

  it('compacte les espaces et les retours à la ligne', () => {
    expect(valueSnippet('Un\n\ntexte   avec espaces', 'texte')).toBe('Un texte avec espaces')
  })
})

describe('helpers d’affichage', () => {
  it('construit l’ancre d’un champ, unique par page', () => {
    expect(fieldAnchor('home', 'hero_title')).toBe('field-home-hero_title')
    expect(fieldAnchor('faq', 'hero_title')).not.toBe(fieldAnchor('home', 'hero_title'))
  })

  it('distingue les champs textuels des champs structurés', () => {
    expect(isTextualField('text')).toBe(true)
    expect(isTextualField('textarea')).toBe(true)
    expect(isTextualField('richtext')).toBe(true)
    expect(isTextualField('list')).toBe(false)
    expect(isTextualField('sections')).toBe(false)
    expect(isTextualField('image')).toBe(false)
  })

  it('lit les textes d’origine de toutes les pages du site', () => {
    // Garde-fou : l'index s'appuie sur PAGE_DEFAULTS, qui doit couvrir les pages éditoriales.
    expect(Object.keys(PAGE_DEFAULTS).length).toBeGreaterThan(10)
    const index = buildContentIndex(
      [{ page: 'home', pageLabel: 'Accueil', emoji: '🏠', key: 'hero_title', label: 'Hero — Titre', type: 'text' }],
      [],
      PAGE_DEFAULTS,
    )
    expect(index[0].defaultValue).toBe(PAGE_DEFAULTS.home.hero_title)
  })
})

describe('replaceInText', () => {
  it('remplace toutes les occurrences, sans tenir compte des accents ni de la casse', () => {
    const { text, count } = replaceInText('Une équipe alignée, ÉQUIPE soudée', 'equipe', 'collectif')
    expect(count).toBe(2)
    expect(text).toBe('Une collectif alignée, Collectif soudée')
  })

  it('conserve la majuscule initiale du mot remplacé', () => {
    expect(replaceInText('Organisations et organisations', 'organisations', 'entreprises').text).toBe(
      'Entreprises et entreprises',
    )
    expect(replaceInText('ORGANISATIONS', 'organisations', 'entreprises').text).toBe('Entreprises')
  })

  it('garde la majuscule du remplacement quand elle est déjà saisie', () => {
    expect(replaceInText('les offres', 'offres', 'Formules').text).toBe('les Formules')
  })

  it('remplace un mot qui contient des accents', () => {
    expect(replaceInText('Le témoignage de Léa', 'témoignage', 'récit').text).toBe('Le récit de Léa')
  })

  it('laisse le texte intact sans correspondance', () => {
    const value = 'Un texte sans le mot cherché'
    const result = replaceInText(value, 'introuvable', 'x')
    expect(result).toEqual({ text: value, count: 0 })
  })

  it('ne remplace rien quand la recherche est vide', () => {
    expect(replaceInText('Bonjour', '   ', 'x')).toEqual({ text: 'Bonjour', count: 0 })
  })

  it('accepte un remplacement vide (suppression du mot)', () => {
    expect(replaceInText('Pour les organisations, tout de suite', ' organisations', '').text).toBe(
      'Pour les, tout de suite',
    )
  })

  it('ne boucle pas sur un remplacement qui contient la recherche', () => {
    const { text, count } = replaceInText('coaching', 'coaching', 'coaching de vie')
    expect(count).toBe(1)
    expect(text).toBe('coaching de vie')
  })

  it('préserve les retours à la ligne et la mise en forme du reste du texte', () => {
    expect(replaceInText('Titre\n\n**zephyr** et suite', 'zephyr', 'Boréal').text).toBe('Titre\n\n**Boréal** et suite')
  })
})

describe('planReplacements', () => {
  const rows = [
    { page: 'home', block_key: 'hero_title', value: 'Zephyr, coach pour dirigeants — Zephyr à Lyon' },
    { page: 'home', block_key: 'hero_image', value: '/images/zephyr.jpg' },
    { page: 'faq', block_key: 'faq_questions', value: '[{"q":"Zephyr ?"}]' },
    { page: 'coaching', block_key: 'intro_title', value: 'Le zephyr souffle' },
  ]
  const index = buildContentIndex(DEFS, rows, DEFAULTS)

  it('propose les champs de texte libre et les textes des cartes', () => {
    const plan = planReplacements(index, 'zephyr', 'Boréal')
    expect(plan.map(i => i.field.key)).toEqual(['hero_title', 'faq_questions', 'intro_title'])
    expect(plan[1].cards?.map(c => c.fieldLabel)).toEqual(['Question'])
    expect(isReplaceableField('image')).toBe(false)
    expect(isReplaceableField('list')).toBe(false)
    expect(isReplaceableField('select')).toBe(false)
    expect(isReplaceableField('textarea')).toBe(true)
  })

  it('calcule la valeur de remplacement et le nombre d’occurrences', () => {
    const plan = planReplacements(index, 'zephyr', 'Boréal')
    expect(plan[0].before).toBe('Zephyr, coach pour dirigeants — Zephyr à Lyon')
    expect(plan[0].after).toBe('Boréal, coach pour dirigeants — Boréal à Lyon')
    expect(plan[0].count).toBe(2)
    expect(parseItems(plan[1].after)).toEqual([{ q: 'Boréal ?', a: '' }])
    expect(plan.find(i => i.field.key === 'intro_title')?.after).toBe('Le Boréal souffle')
  })

  it('part du brouillon quand il existe', () => {
    const withDraft = buildContentIndex(
      DEFS,
      [...rows, { page: 'draft:coaching', block_key: 'intro_title', value: 'Zephyr en brouillon' }],
      DEFAULTS,
    )
    const item = planReplacements(withDraft, 'zephyr', 'Boréal').find(i => i.field.key === 'intro_title')
    expect(item?.before).toBe('Zephyr en brouillon')
    expect(item?.after).toBe('Boréal en brouillon')
  })

  it('ignore un remplacement sans effet (mot identique)', () => {
    expect(planReplacements(index, 'zephyr', 'zephyr')).toEqual([])
    expect(planReplacements(index, '', 'Boréal')).toEqual([])
  })

  it('résume le nombre de textes, de pages et d’occurrences', () => {
    expect(replacementStats(planReplacements(index, 'zephyr', 'Boréal'))).toEqual({
      fields: 3,
      pages: 3,
      occurrences: 4,
    })
    expect(replacementStats([])).toEqual({ fields: 0, pages: 0, occurrences: 0 })
  })
})

describe('remplacement dans les cartes des listes', () => {
  const DEFS_CARDS: ContentFieldDef[] = [
    { page: 'coaching', pageLabel: 'Coaching', emoji: '⭐', key: 'coaching_programs', label: 'Programmes — Cartes', type: 'list' },
    { page: 'faq', pageLabel: 'FAQ', emoji: '❓', key: 'faq_questions', label: 'Questions — Cartes', type: 'list' },
  ]

  const JSON_ONLY = { coaching: { coaching_programs: '' }, faq: { faq_questions: '' } }

  const cardsIndex = buildContentIndex(
    DEFS_CARDS,
    [
      {
        page: 'coaching',
        block_key: 'coaching_programs',
        value: JSON.stringify([
          { label: 'Séance Zephyr', price: '120 €', href: '/zephyr', highlight: 'oui', desc: 'Le zephyr au travail' },
          { label: 'Autre', price: 'Sur devis', href: 'calendly', highlight: 'non', desc: 'Sans le mot' },
        ]),
      },
    ],
    JSON_ONLY,
  )

  it('remplace dans les textes des cartes, mais pas dans les liens ni les choix fermés', () => {
    const plan = planReplacements(cardsIndex, 'zephyr', 'Boréal')
    expect(plan).toHaveLength(1)
    const item = plan[0]
    expect(item.field.key).toBe('coaching_programs')
    expect(item.count).toBe(2)
    // Un lien (« /zephyr ») et le choix « oui/non » ne sont jamais modifiés.
    const after = parseItems(item.after)
    expect(after?.[0]).toMatchObject({
      label: 'Séance Boréal',
      desc: 'Le Boréal au travail',
      href: '/zephyr',
      highlight: 'oui',
      price: '120 €',
    })
    expect(after?.[1]).toMatchObject({ label: 'Autre', desc: 'Sans le mot' })
  })

  it('décrit chaque texte modifié, carte par carte', () => {
    const item = planReplacements(cardsIndex, 'zephyr', 'Boréal')[0]
    expect(item.cards).toEqual([
      {
        index: 0,
        name: 'Programme 1 — Séance Zephyr',
        fieldLabel: 'Nom du programme',
        before: 'Séance Zephyr',
        after: 'Séance Boréal',
        count: 1,
      },
      {
        index: 0,
        name: 'Programme 1 — Séance Zephyr',
        fieldLabel: 'Description',
        before: 'Le zephyr au travail',
        after: 'Le Boréal au travail',
        count: 1,
      },
    ])
  })

  it('compte les textes de carte comme des textes (et non la liste comme un seul champ)', () => {
    expect(replacementStats(planReplacements(cardsIndex, 'zephyr', 'Boréal'))).toEqual({
      fields: 2,
      pages: 1,
      occurrences: 2,
    })
  })

  it('relit les cartes des anciens champs numérotés quand aucune liste n’a été enregistrée', () => {
    const legacy = buildContentIndex(
      DEFS_CARDS,
      [],
      {
        coaching: {
          coaching_programs: '',
          program_1_label: 'Zephyr découverte',
          program_1_desc: 'Une séance avec le zephyr',
          program_1_price: 'Gratuit',
        },
        faq: { faq_questions: '' },
      },
    )
    expect(legacy[0].listItems?.[0]).toMatchObject({ label: 'Zephyr découverte', href: 'calendly' })
    const item = planReplacements(legacy, 'zephyr', 'Boréal')[0]
    expect(item.cards?.map(c => c.fieldLabel)).toEqual(['Nom du programme', 'Description'])
    // La liste est alors écrite en JSON : les valeurs déduites de la position sont conservées.
    expect(parseItems(item.after)?.[0]).toMatchObject({
      label: 'Boréal découverte',
      price: 'Gratuit',
      href: 'calendly',
      highlight: 'non',
    })
  })

  it('ne touche ni aux choix fermés, ni aux listes vides, ni à un mot identique', () => {
    expect(planReplacements(cardsIndex, 'oui', 'non')).toEqual([])
    const empty = buildContentIndex(
      DEFS_CARDS,
      [{ page: 'coaching', block_key: 'coaching_programs', value: '[]' }],
      JSON_ONLY,
    )
    expect(planReplacements(empty, 'zephyr', 'Boréal')).toEqual([])
    expect(planReplacements(cardsIndex, 'zephyr', 'zephyr')).toEqual([])
  })
})
